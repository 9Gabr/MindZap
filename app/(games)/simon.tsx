import { useEffect, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { styles } from "@/styles/styles";
import { moderateScale } from "react-native-size-matters";
import { colors } from "@/styles/colors";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import HelpModal from "@/components/HelpModal";
import EndGameModal from "@/components/EndGameModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

const incrementWins = async () => {
  try {
    // Obtém o valor atual (caso não exista, assume 0)
    const currentWins = await AsyncStorage.getItem("wins");
    const newWins = (currentWins ? parseInt(currentWins) : 0) + 1;

    // Salva o novo valor
    await AsyncStorage.setItem("wins", newWins.toString());
  } catch (e) {
    console.error(e);
  }
};

export default function Simon() {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [helpVisible, setHelpVisible] = useState<boolean>(false);
  const [sequence, setSequence] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("start");
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [playerSeq, setPlayerSeq] = useState<string[]>([]);
  const [wins, setWins] = useState<number>(0);
  const gameColors = ["red", "green", "blue", "yellow"];
  const messages: { [key: string]: string } = {
    start: "Jogo começando...",
    showing: "Mostrando sequência",
    addColor: "Correto! Adicionando mais uma cor...",
    win: "Correto! Adicionando mais uma cor...",
    playing: "Sua vez de jogar",
    lose: "Que pena, você errou!"
  };

  // Gera um nova sequência, ou então adiciona mais uma cor
  function generateSequence() {
    const newSeq: string[] = [];
    if (status === "start") {
      for (let i = 0; i < 4; i++) {
        newSeq.push(gameColors[Math.round(Math.random() * 3)]);
      }
      setSequence(newSeq);
    }
    if (status === "addColor") {
      newSeq.push(gameColors[Math.round(Math.random() * 3)]);
      setSequence((prev) => [...prev, ...newSeq]);
    }
  }

  // Função que mostra a sequência atual para o jogador
  function showSequence() {
    setStatus("showing");
    setTimeout(() => {
      sequence.forEach((color, index) => {
        setTimeout(() => {
          setHighlighted(color);
          setTimeout(() => setHighlighted(null), 500);
        }, index * 1000);
      });
    }, 1000);
    setTimeout(() => {
      setStatus("playing");
    }, sequence.length * 1000 + 1000);
  }

  // Checa a jogada
  function checkPlayer() {
    if (playerSeq.length < sequence.length) {
      if (playerSeq[playerSeq.length - 1] !== sequence[playerSeq.length - 1]) {
        setStatus("lose");
        setModalVisible(true);
      }
    }
    if (playerSeq.length > 3 && playerSeq.length === sequence.length) {
      setPlayerSeq([]);
      setWins((prev) => prev + 1);
      incrementWins();
      setStatus("win");
      setTimeout(() => {
        setStatus("addColor");
      }, 2000);
    }
  }

  // Função que inicia o jogo
  function handleStart() {
    setStatus("start");
    setPlayerSeq([]);
    setSequence([]);
    setWins(0);
    generateSequence();
    setModalVisible(false);
    setHelpVisible(false);
  }

  // Usado para iniciar o jogo assim que o componente for montado (ao carregar a tela)
  useEffect(() => {
    handleStart(); // Inicia o jogo ao carregar o componente
  }, []);

  // Efeito para chamar a função showSequence após atualizar a sequência
  useEffect(() => {
    if (sequence.length > 0) {
      showSequence(); // Chamando a função para mostrar a sequência depois de gerar
    }
  }, [sequence]); // O efeito é disparado quando a sequência for atualizada

  useEffect(() => {
    checkPlayer();
  }, [playerSeq]);

  useEffect(() => {
    generateSequence();
  }, [status]);

  return (
    <View style={styles.container}>
      {/* Cabeçalho com título e ícone de ajuda */}
      <View
        style={[
          styles.containerNoFlex,
          { flexDirection: "row", marginBottom: 32 }
        ]}>
        <Text style={[styles.title, { marginRight: 16 }]}>Sequência</Text>
        <Pressable onPress={() => setHelpVisible(true)}>
          <MaterialIcons
            name="help"
            size={moderateScale(20)}
            color={colors.text}
          />
        </Pressable>
      </View>

      {/* Jogo */}
      <View>
        <Text style={[styles.text, { textAlign: "center", marginBottom: 16 }]}>
          {`Sequências corretas: ${wins}`}
        </Text>
        <Text style={[styles.text, { textAlign: "center" }]}>
          {messages[status]}
        </Text>
        <View style={[styles.containerNoFlex, { flexDirection: "row" }]}>
          <TouchableOpacity
            style={[
              styles.simonSqures,
              {
                backgroundColor: colors.red,
                borderColor: colors.maroon,
                opacity: highlighted === "red" ? 0.2 : 1
              }
            ]}
            onPress={() => setPlayerSeq((prev) => [...prev, "red"])}
          />
          <TouchableOpacity
            style={[
              styles.simonSqures,
              {
                backgroundColor: colors.green,
                borderColor: "#51c936",
                opacity: highlighted === "green" ? 0.2 : 1
              }
            ]}
            onPress={() => setPlayerSeq((prev) => [...prev, "green"])}
          />
        </View>
        <View style={[styles.containerNoFlex, { flexDirection: "row" }]}>
          <TouchableOpacity
            style={[
              styles.simonSqures,
              {
                backgroundColor: colors.blue,
                borderColor: colors.sky,
                opacity: highlighted === "blue" ? 0.2 : 1
              }
            ]}
            onPress={() => setPlayerSeq((prev) => [...prev, "blue"])}
          />
          <TouchableOpacity
            style={[
              styles.simonSqures,
              {
                backgroundColor: colors.peach,
                borderColor: colors.yellow,
                opacity: highlighted === "yellow" ? 0.2 : 1
              }
            ]}
            onPress={() => setPlayerSeq((prev) => [...prev, "yellow"])}
          />
        </View>
      </View>

      {/* Botão para voltar antes de finlizar. */}
      <View>
        <Pressable
          style={[
            styles.endGameButton,
            {
              backgroundColor: colors.red,
              borderColor: colors.maroon,
              opacity: modalVisible ? 0 : helpVisible ? 0 : 1
            }
          ]}
          onPress={() => {
            router.push("/(tabs)");
          }}>
          <Text style={styles.endGameButtonText}>Voltar</Text>
        </Pressable>
      </View>

      {/* Modais de finalização e ajuda */}
      <EndGameModal
        visible={modalVisible}
        repeat={handleStart}
        message={status === "lose" ? messages[status] : null}
        win={status !== "lose"}
        closeModal={() => setModalVisible(false)}
      />
      <HelpModal
        visible={helpVisible}
        helpText={`Inspirado no clássico "Genius" ou "Simon", onde uma sequência de cores é mostrada, e você precisa reproduzi-la. A sequência aumenta a cada rodada, estimulando a memória e a atenção.`}
        play={handleStart}
      />
    </View>
  );
}
