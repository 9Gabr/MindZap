import { colors } from "@/styles/colors";
import { styles } from "@/styles/styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Modal, Pressable, Text, View } from "react-native";
import { moderateScale, scale } from "react-native-size-matters";

type Props = {
  visible: boolean;
  helpText: string;
  play: () => void;
};

export default function HelpModal({ visible, helpText, play }: Props) {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={[styles.modalContainer]}>
        <View style={[styles.modalView, { maxWidth: 600 }]}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Como jogar?</Text>
            <Text
              style={[
                {
                  marginHorizontal: moderateScale(30),
                  marginVertical: moderateScale(20),
                  fontSize: moderateScale(12),
                  color: colors.text
                }
              ]}>
              {helpText}
            </Text>
            <Pressable
              style={[
                styles.modalButtons,
                { backgroundColor: colors.peach, borderColor: colors.yellow }
              ]}
              onPress={play}>
              <MaterialIcons name="play-arrow" size={40} color={colors.text} />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  color: colors.text
                }}>
                Jogar
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
