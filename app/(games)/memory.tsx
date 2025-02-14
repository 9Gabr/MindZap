import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "@/styles/styles";
import { moderateScale, scale } from "react-native-size-matters";
import { colors } from "@/styles/colors";
import { router } from "expo-router";
import EndGameModal from "@/components/EndGameModal";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import HelpModal from "@/components/HelpModal";
import AntDesign from "@expo/vector-icons/AntDesign";
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

export default function Memory() {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [helpVisible, setHelpVisible] = useState<boolean>(false);
  const [cards, setCards] = useState<
    { symbol: string; fliped: boolean; matched: boolean }[]
  >([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [matcheds, setMatcheds] = useState<number>(0);

  // Monta a "mesa" mostrando as cartas para o jogador virar.
  function table() {
    if (cards?.length !== 0) {
      const tableCards = cards?.map((card, index) => {
        return (
          <View
            style={{
              flexBasis: "25%",
              padding: 8,
              justifyContent: "center",
              alignItems: "center"
            }}
            key={`card-${index}`}>
            <Pressable
              style={{
                width: scale(60),
                height: scale(60),
                maxWidth: 160,
                maxHeight: 160,
                borderRadius: 16,
                shadowOffset: { width: 0, height: 15 },
                shadowOpacity: 0.2,
                shadowRadius: 30,
                elevation: 5,
                shadowColor: "#000",
                backgroundColor: card.matched
                  ? colors.green
                  : card.fliped
                  ? colors.yellow
                  : colors.pink,
                justifyContent: "center",
                alignItems: "center"
              }}
              onPress={
                card.matched
                  ? null
                  : () => setSelected((prev) => [...prev, index])
              }>
              <Text style={{ fontSize: moderateScale(12) }}>
                {card.matched ? (
                  card.symbol
                ) : card.fliped ? (
                  card.symbol
                ) : (
                  <AntDesign
                    name="questioncircle"
                    size={moderateScale(16)}
                    color={colors.text}
                  />
                )}
              </Text>
            </Pressable>
          </View>
        );
      });
      return tableCards;
    }
  }

  // Embaralha as cartas utilizando do metódo Fisher-Yates, fazendo com que retorne o dobro de symbols, para assim formar pars.
  function suffleCards() {
    const symbols = ["🍎", "🍌", "🍇", "🍉"];

    const shuffleArray = (arr: any[]) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    setCards(
      [...shuffleArray(symbols), ...shuffleArray(symbols)].map(
        (symbol: string) => ({
          symbol,
          fliped: false,
          matched: false
        })
      )
    );
  }

  function handleStart() {
    setModalVisible(false); // Fecha o modal final quando o jogo começa
    setHelpVisible(false); // Fecha o modal de ajuda, se estiver aberto
    setCards([]);
    suffleCards();
    setSelected([]);
    setMatcheds(0);
  }

  function handleSelect() {
    if (selected.length === 1) {
      const [firstSelected] = selected; // separa as duas selecionadas.
      const updateCards = [...cards]; // copia os cards para trocar os estados
      updateCards[firstSelected].fliped = true; // troca o estado da carta
      setCards([...updateCards]); // atualiza o estado de todas as cartas.
    }

    if (selected.length === 2) {
      const [firstSelected, secondSelected] = selected; // separa as duas selecionadas.
      const updateCards = [...cards]; // copia os cards para trocar os estados
      const firstSymbol = updateCards[firstSelected].symbol;
      const secondSymbol = updateCards[secondSelected].symbol;

      updateCards[secondSelected].fliped = true; // troca o estado da carta

      if (firstSymbol === secondSymbol) {
        // se os simbolos forem iguais marca como achados.
        updateCards[firstSelected].matched = true;
        updateCards[secondSelected].matched = true;
        // adiciona 1 aos achados.
        setMatcheds((prev) => prev + 1);
      }

      setTimeout(() => {
        updateCards[firstSelected].fliped = false; // troca o estado da carta
        updateCards[secondSelected].fliped = false; // troca o estado da carta
        setCards([...updateCards]);
      }, 1500);

      setCards([...updateCards]);
      setSelected([]);
    }
  }

  // Função que verifica se os resultados inseridos estão corretos
  function handleEnd() {
    if (matcheds === 4) {
      setModalVisible(true);
      incrementWins();
    }
  }

  // Usado para iniciar o jogo assim que o componente for montado (ao carregar a tela)
  useEffect(() => {
    handleStart();
  }, []);

  // Usado para verificar se alguma carta foi selecionada.
  useEffect(() => {
    handleSelect();
  }, [selected]);

  // usado para verificar final de jogo, ativando a função quando matcheds for alterado
  useEffect(() => {
    handleEnd();
  }, [matcheds]);

  return (
    <View style={styles.container}>
      {/* Cabeçalho com título e ícone de ajuda */}
      <View
        style={[
          styles.containerNoFlex,
          { flexDirection: "row", marginBottom: 32 }
        ]}>
        <Text style={[styles.title, { marginRight: 16 }]}>Memory</Text>
        <Pressable onPress={() => setHelpVisible(true)}>
          <MaterialIcons
            name="help"
            size={moderateScale(20)}
            color={colors.text}
          />
        </Pressable>
      </View>

      {/* Jogo */}

      <View
        style={[
          styles.containerNoFlex,
          {
            flexDirection: "row",
            width: "80%",
            maxWidth: 800,
            flexWrap: "wrap",
            marginBottom: 32
          }
        ]}>
        {table()}
      </View>

      {/* Botão voltar */}
      <View>
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
        win={true}
        closeModal={() => setModalVisible(false)}
      />
      <HelpModal
        visible={helpVisible}
        helpText="No jogdo da memória, você deve achar os pares espalhados. Assim treinando a memória de curto prazo. Boa sorte!"
        play={handleStart}
      />
    </View>
  );
}
