import { styles } from "@/styles/styles";
import { colors } from "@/styles/colors";
import { Modal, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { moderateScale, scale } from "react-native-size-matters";

type Props = {
  visible: boolean;
  repeat: () => void;
  message?: string | null;
  win: boolean;
  closeModal: () => void;
};

export default function EndGameModal({
  visible,
  repeat,
  message,
  win,
  closeModal
}: Props) {
  const handleGamesPress = () => {
    closeModal();
    router.push("/(tabs)");
  };
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={[styles.modalView, { maxWidth: 600 }]}>
          <View style={styles.modalContainer}>
            {win ? (
              <Text style={[styles.title, { marginBottom: scale(16) }]}>
                Parabéns!
              </Text>
            ) : null}
            {message ? (
              <View>
                <Text style={[styles.title, { marginBottom: scale(16) }]}>
                  {message}
                </Text>
              </View>
            ) : null}
            <View style={{ flexDirection: "row" }}>
              <Pressable
                style={[
                  styles.modalButtons,
                  { backgroundColor: colors.peach, borderColor: colors.yellow }
                ]}
                onPress={repeat}>
                <MaterialIcons
                  name="repeat"
                  size={moderateScale(40)}
                  color={colors.text}
                />
                <Text
                  style={{
                    fontSize: moderateScale(12),
                    fontWeight: "bold",
                    color: colors.text
                  }}>
                  Repetir
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.modalButtons,
                  { backgroundColor: colors.blue, borderColor: colors.sky }
                ]}
                onPress={handleGamesPress}>
                <MaterialIcons
                  name="games"
                  size={moderateScale(40)}
                  color={colors.text}
                />
                <Text
                  style={{
                    fontSize: moderateScale(12),
                    fontWeight: "bold",
                    color: colors.text
                  }}>
                  Jogos
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
