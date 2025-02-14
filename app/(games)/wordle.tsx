import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { styles } from "@/styles/styles";
import { moderateScale } from "react-native-size-matters";
import { colors } from "@/styles/colors";
import { router } from "expo-router";
import { words } from "@/utils/words";
import EndGameModal from "@/components/EndGameModal";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import HelpModal from "@/components/HelpModal";
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

export default function Wordle() {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [helpVisible, setHelpVisible] = useState<boolean>(false);
  const [word, setWord] = useState<string[]>([]);
  const [chances, setChances] = useState<number>(6);
  const [playerInput, setPlayerInput] = useState<string>("");
  const [gueses, setGueses] = useState<JSX.Element[][]>([]);
  const [win, setWin] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const renderGueses = gueses.map((guess, index) => (
    <View
      style={[styles.containerNoFlex, { flexDirection: "row" }]}
      key={`row-${index}`}>
      {guess}
    </View>
  ));

  const handleCheck = () => {
    const inputArr = playerInput.split("");

    if (chances !== 0 && playerInput !== word.join()) {
      const tableRow: JSX.Element[] = [];
      for (let i = 0; i < word.length; i++) {
        const checkLetter = () => {
          if (inputArr[i] === word[i]) {
            return colors.green;
          } else if (word.includes(inputArr[i])) {
            return colors.yellow;
          } else {
            return colors.red;
          }
        };
        tableRow.push(
          <Text
            style={[styles.wordleBox, { backgroundColor: checkLetter() }]}
            key={`row-${gueses.length}-square${i}`}>
            {playerInput[i]}
          </Text>
        );
      }

      setGueses((prev) => [...prev, tableRow]);
      setChances((prev) => prev - 1);
    }
  };

  // Função que inicia o jogo
  function handleStart() {
    setHelpVisible(false);
    setModalVisible(false);
    setGueses([]);
    setChances(6);
    setMessage(null);
    setWin(false);
    setPlayerInput("");
    const newWord = words[Math.round(Math.random() * words.length - 1)];
    setWord(newWord.split(""));
  }

  function handleEnd() {
    if (playerInput === word.join("") && playerInput !== "") {
      setModalVisible(true);
      setWin(true);
      incrementWins();
    }

    if (chances < 1) {
      setModalVisible(true);
      setWin(false);
      setMessage("Perdeu!");
    }
  }

  useEffect(() => {
    handleStart();
  }, []);

  useEffect(() => {
    handleEnd();
  }, [chances]);

  console.log(word);

  return (
    <View style={styles.container}>
      {/* Cabeçalho com título e ícone de ajuda */}
      <View
        style={[
          styles.containerNoFlex,
          { flexDirection: "row", marginBottom: 12 }
        ]}>
        <Text style={[styles.title, { marginRight: 16 }]}>Termo</Text>
        <Pressable onPress={() => setHelpVisible(true)}>
          <MaterialIcons
            name="help"
            size={moderateScale(20)}
            color={colors.text}
          />
        </Pressable>
      </View>

      {/* Jogo */}
      <View style={[styles.containerNoFlex, { marginBottom: 12 }]}>
        <Text style={styles.text}>Número de letras: {word.length}</Text>
      </View>

      <View style={[styles.containerNoFlex, { marginBottom: 12 }]}>
        {renderGueses}
      </View>

      <View style={[styles.containerNoFlex, { marginBottom: 12 }]}>
        <TextInput
          style={styles.wordleInput}
          maxLength={word.length}
          onChangeText={(e) => setPlayerInput(e)}
          value={playerInput}
        />
      </View>

      {/* Botão para confirmar as respostas e finalizar o jogo, ou voltar antes de finlizar */}
      <View>
        <Pressable style={[styles.endGameButton, { marginBottom: 16 }]}>
          <Text style={styles.endGameButtonText} onPress={() => handleCheck()}>
            Confirmar
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.endGameButton,
            { backgroundColor: colors.red, borderColor: colors.maroon }
          ]}
          onPress={() => router.push("/(tabs)")}>
          <Text style={styles.endGameButtonText}>Voltar</Text>
        </Pressable>
      </View>

      {/* Modais de finalização e ajuda */}
      <EndGameModal
        visible={modalVisible}
        repeat={handleStart}
        win={win}
        message={message}
        closeModal={() => setModalVisible(false)}
      />
      <HelpModal
        visible={helpVisible}
        helpText={`Adivinhe a palavra secreta em até 6 tentativas. 
🎨 As cores ajudam você:
🟩 Verde → Letra certa e no lugar certo.
🟨 Amarelo → Letra certa, mas no lugar errado.
🟥 Vermelho → Letra não está na palavra.
Use a lógica e descubra a palavra! 🚀`}
        play={handleStart}
      />
    </View>
  );
}
