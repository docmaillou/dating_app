import React, { useState, useEffect, useRef } from "react";
import TopBar from "./app/screens/TopBar";
import { View, StyleSheet, Alert } from "react-native";
import Constants from "expo-constants";
import BottomBar from "./app/screens/BottomBar";
import Swipes from "./app/screens/Swipes";

import axios from "axios";
function App() {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const swipesRef = useRef(null);
  async function fetchUsers() {
    try {
      const { data } = await axios.get(
        "https://api.jikan.moe/v3/top/characters/1"
      );
      setUsers(data.top);
    } catch (error) {
      console.log(error);
      Alert.alert("error getting users", "", [
        { text: "Retry", onPress: () => fetchUsers() },
      ]);
    }
  }
  useEffect(() => {
    fetchUsers();
  }, []);

  function handleLike() {
    console.log("like");
    nextUser();
  }
  function handlePass() {
    console.log("pass");
    nextUser();
  }
  function nextUser() {
    const nextIndex = users.length - 2 === currentIndex ? 0 : currentIndex + 1;
    setCurrentIndex(nextIndex);
  }

  function handleLikePress() {
    swipesRef.current.openLeft();
  }
  function handlePassPress() {
    swipesRef.current.openRight();
  }
  return (
    <View style={styles.container}>
      <TopBar />
      <View style={styles.swipes}>
        {users.length > 1 &&
          users.map(
            (u, i) =>
              currentIndex === i && (
                <Swipes
                  key={i}
                  ref={swipesRef}
                  currentIndex={currentIndex}
                  users={users}
                  handleLike={handleLike}
                  handlePass={handlePass}
                ></Swipes>
              )
          )}
      </View>
      <BottomBar
        handleLikePress={handleLikePress}
        handlePassPress={handlePassPress}
      />
    </View>
  );
}

export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  swipes: {
    flex: 1,
    padding: 10,
    paddingTop: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
});
