import { colors } from "@/styles/colors";
import { StyleSheet } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.base,
    color: colors.text
  },
  containerNoFlex: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.base,
    color: colors.text
  },
  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: scale(100),

    height: scale(100),
    borderRadius: moderateScale(16),
    borderWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 5
  },
  cardText: {
    fontSize: scale(12),
    fontWeight: "bold",
    color: colors.text
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    color: colors.text
  },
  text: {
    fontSize: moderateScale(16),
    color: colors.text
  },
  textInput: {
    width: 60,
    height: 40,
    fontSize: 16,
    backgroundColor: colors.text,
    color: colors.crust
  },
  endGameButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 60,
    borderRadius: 16,
    borderWidth: 4,
    backgroundColor: colors.blue,
    borderColor: colors.sky,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 5
  },
  endGameButtonText: {
    color: colors.text,
    fontWeight: "bold",
    fontSize: moderateScale(12)
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  modalView: {
    width: "80%",
    height: "50%",
    backgroundColor: colors.crust,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 5
  },
  modalButtons: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
    width: scale(60),
    height: scale(60),
    maxWidth: 125,
    maxHeight: 125,
    borderRadius: 16,
    borderWidth: 4,
    color: colors.text,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 5
  },
  simonSqures: {
    padding: scale(60),
    borderRadius: 16,
    borderWidth: 4,
    margin: 20
  },
  wordleInput: {
    fontSize: moderateScale(16),
    width: 150,
    borderRadius: 8,
    textAlign: "center",
    textTransform: "uppercase",
    backgroundColor: colors.text,
    color: colors.crust
  },
  wordleBox: {
    fontSize: moderateScale(16),
    padding: 10,
    marginHorizontal: 12,
    marginVertical: 16,
    borderRadius: 8,
    textAlign: "center",
    textTransform: "uppercase",
    backgroundColor: colors.text,
    color: colors.crust
  }
});
