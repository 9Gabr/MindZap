import { styles } from "@/styles/styles";
import { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { colors } from "@/styles/colors";
import { moderateScale } from "react-native-size-matters";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";

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
  const [currentWins, setCurrentWins] = useState<number>();

  useEffect(() => {
    const getUserName = async () => {
      const storedName = await getFromStorage("userName");
      setUserName(storedName);
      console.log(storedName);
    };
    const getWins = async () => {
      const storedWins = await getFromStorage("wins");
      setCurrentWins(storedWins);
    };
    getWins();
    getUserName();
  }, []);

  console.log(currentWins);

  return (
    <View style={[styles.container, { gap: 16 }]}>
      <Ionicons
        name="person-circle-sharp"
        size={moderateScale(40)}
        color={colors.text}
      />
      <Text style={[styles.title, { textAlign: "center" }]}>{userName}</Text>
      <Text style={[styles.text, { textAlign: "center" }]}>
        Número de vitórias: {currentWins}
      </Text>
    </View>
  );
}
