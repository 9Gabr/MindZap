import { useEffect, useState } from "react";
import { styles } from "@/styles/styles";
import { Link } from "expo-router";
import { Pressable, Text, TextInput, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { colors } from "@/styles/colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AsyncStorage from "@react-native-async-storage/async-storage";

const saveToStorage = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(e);
  }
};

const getFromStorage = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export default function Index() {
  const [userName, setUserName] = useState<string | null>(null);
  const [newUserName, setNewUserName] = useState<string>("");

  useEffect(() => {
    const getUserName = async () => {
      const storedName = await getFromStorage("userName");
      setUserName(storedName);
      console.log(storedName);
    };
    getUserName();
  }, []);

  const handleConfirm = async () => {
    if (newUserName.trim()) {
      await saveToStorage("userName", newUserName);
      setUserName(newUserName);
    }
  };

  if (userName === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Olá, vejo que é a primeira vez no APP.</Text>
        <Text style={[styles.text, { marginBottom: 16 }]}>
          Digite seu nome abaixo:
        </Text>
        <TextInput
          style={[
            styles.textInput,
            {
              width: moderateScale(150),
              borderRadius: 16,
              marginBottom: 16,
              textAlign: "center",
              fontSize: moderateScale(16)
            }
          ]}
          value={newUserName}
          onChangeText={(res) => setNewUserName(res)}
        />
        <Pressable
          style={[
            styles.endGameButton,
            { backgroundColor: colors.green, borderColor: "#51c936" }
          ]}
          onPress={handleConfirm}>
          Confirmar
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { marginBottom: 16 }]}>
        Olá {userName}, o que deseja jogar?
      </Text>

      {/* primeira parte da lista */}

      <View
        style={[
          styles.containerNoFlex,
          { flexDirection: "row", gap: 20, marginBottom: 16 }
        ]}>
        <Link href={"/(games)/quickmath"}>
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.blue,
                borderColor: colors.sky
              }
            ]}>
            <MaterialCommunityIcons
              name="plus-minus-variant"
              size={moderateScale(40)}
              color={colors.text}
            />
            <Text style={styles.cardText}>Quick Math</Text>
          </View>
        </Link>
        <Link href={"/(games)/simon"}>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.mauve, borderColor: colors.pink }
            ]}>
            <AntDesign
              name="appstore1"
              size={moderateScale(40)}
              color={colors.text}
            />
            <Text style={styles.cardText}>Sequências</Text>
          </View>
        </Link>
      </View>

      {/* Segunda parte da lista */}

      <View style={[styles.containerNoFlex, { flexDirection: "row", gap: 20 }]}>
        <Link href={"/(games)/wordle"}>
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.green,
                borderColor: "#51c936"
              }
            ]}>
            <MaterialIcons
              name="font-download"
              size={moderateScale(40)}
              color={colors.text}
            />
            <Text style={styles.cardText}>Termo</Text>
          </View>
        </Link>
        <Link href={"/(games)/memory"}>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.pink, borderColor: colors.flamingo }
            ]}>
            <FontAwesome6
              name="brain"
              size={moderateScale(40)}
              color={colors.text}
            />
            <Text style={styles.cardText}>Memória</Text>
          </View>
        </Link>
      </View>
    </View>
  );
}
