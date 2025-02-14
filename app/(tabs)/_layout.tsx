import { Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { colors } from "@/styles/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.sky,
        tabBarInactiveTintColor: colors.surface2,
        tabBarStyle: {
          backgroundColor: colors.crust,
          borderColor: colors.crust
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Jogos",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="games" size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          )
        }}
      />
    </Tabs>
  );
}
