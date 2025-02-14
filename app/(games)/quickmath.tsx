import { useEffect, useState, useRef } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { styles } from "@/styles/styles";
import { moderateScale, scale } from "react-native-size-matters";
import { colors } from "@/styles/colors";
import { router } from "expo-router";
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

export default function QuickMath() {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [helpVisible, setHelpVisible] = useState<boolean>(false);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [calcOperators, setCalcOperators] = useState<string[]>([]);

  // Resultados inseridos pelo jogador
  const [res1, setRes1] = useState<string>();
  const [res2, setRes2] = useState<string>();
  const [res3, setRes3] = useState<string>();

  // Referência para o campo de input, para focar automaticamente quando o jogo começar
  const inputRef = useRef<TextInput>(null);

  // Definindo os cálculos a serem apresentados na tela, com base nos números e operadores gerados
  const calc1 = numbers[0] + calcOperators[0] + numbers[1];
  const calc2 = numbers[2] + calcOperators[1] + numbers[3];
  const calc3 = numbers[4] + calcOperators[2] + numbers[5];

  // Função de avaliação segura que executa a expressão matemática
  const safeEval = (expression: string) => {
    return new Function(`return ${expression}`)();
  };

  // Função que inicia o jogo e gera números aleatórios e operadores para os cálculos
  function handleStart() {
    setModalVisible(false); // Fecha o modal final quando o jogo começa
    setHelpVisible(false); // Fecha o modal de ajuda, se estiver aberto
    const operators = [" + ", " - ", " * ", " / "]; // Operadores possíveis para os cálculos
    const generatedNumbers = [];
    const generatedOperators = [];

    // Gera 6 números aleatórios e seus respectivos operadores
    for (let i = 0; i < 6; i++) {
      const num = Math.round(Math.random() * 15); // Números aleatórios entre 0 e 15
      generatedNumbers.push(num);
      if (i === 0 || i % 2 !== 0) {
        generatedOperators.push(operators[Math.round(Math.random() * 3)]); // Aleatoriamente escolhe um operador
      }
    }

    // Atualiza os estados com os números e operadores gerados
    setCalcOperators(generatedOperators);
    setNumbers(generatedNumbers);
  }

  // Função que verifica se os resultados inseridos estão corretos
  function handleEnd() {
    if (
      Number(res1) === Math.round(safeEval(calc1)) && // Verifica se o primeiro resultado está correto
      Number(res2) === Math.round(safeEval(calc2)) && // Verifica se o segundo resultado está correto
      Number(res3) === Math.round(safeEval(calc3)) // Verifica se o terceiro resultado está correto
    ) {
      setModalVisible(true); // Se todos os resultados estiverem corretos, exibe o modal de final de jogo
      incrementWins();
    } else {
      alert("Você errou uma ou mais contas."); // Exibe um alerta caso algum cálculo esteja errado
    }
  }

  // Usado para iniciar o jogo assim que o componente for montado (ao carregar a tela)
  useEffect(() => {
    handleStart(); // Inicia o jogo ao carregar o componente
    inputRef.current?.focus(); // Foca no primeiro campo de entrada para facilitar a interação
  }, []);

  return (
    <View style={styles.container}>
      {/* Cabeçalho com título e ícone de ajuda */}
      <View
        style={[
          styles.containerNoFlex,
          { flexDirection: "row", marginBottom: 32 }
        ]}>
        <Text style={[styles.title, { marginRight: 16 }]}>Quick Math</Text>
        <Pressable onPress={() => setHelpVisible(true)}>
          <MaterialIcons
            name="help"
            size={moderateScale(20)}
            color={colors.text}
          />
        </Pressable>
      </View>

      {/* Exibe os três cálculos gerados, um por vez, com campo de entrada para o usuário */}
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          marginBottom: 16
        }}>
        <Text style={[styles.text, { width: scale(45) }]}>{`${calc1}`}</Text>
        <Text style={[styles.text, { marginRight: scale(12) }]}>=</Text>
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          ref={inputRef}
          value={res1}
          onChangeText={(e) => setRes1(e)} // Atualiza o resultado 1 conforme o usuário digita
        />
      </View>

      {/* Repetindo o mesmo layout para os cálculos 2 e 3 */}
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          marginBottom: 16
        }}>
        <Text style={[styles.text, { width: scale(45) }]}>{`${calc2}`}</Text>
        <Text style={[styles.text, { marginRight: scale(12) }]}>=</Text>
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          value={res2}
          onChangeText={(e) => setRes2(e)} // Atualiza o resultado 2 conforme o usuário digita
        />
      </View>

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          marginBottom: 32
        }}>
        <Text style={[styles.text, { width: scale(45) }]}>{`${calc3}`}</Text>
        <Text style={[styles.text, { marginRight: scale(12) }]}>=</Text>
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          value={res3}
          onChangeText={(e) => setRes3(e)} // Atualiza o resultado 3 conforme o usuário digita
        />
      </View>

      {/* Botão para confirmar as respostas e finalizar o jogo, ou voltar antes de finlizar. */}
      <View>
        <Pressable
          style={[styles.endGameButton, { marginBottom: 16 }]}
          onPress={() => handleEnd()}>
          <Text style={styles.endGameButtonText}>Confirmar</Text>
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
        win={true}
        closeModal={() => setModalVisible(false)}
      />
      <HelpModal
        visible={helpVisible}
        helpText="No Quick Math, você deve resolver três operações matemáticas simples. Os números são sempre arredondados para evitar decimais, tornando o jogo mais fácil e rápido. Boa sorte!"
        play={handleStart}
      />
    </View>
  );
}
