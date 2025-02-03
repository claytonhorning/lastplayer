import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Alert,
  PanResponder,
} from "react-native";
import Svg, { Circle, Rect } from "react-native-svg";

const { width, height } = Dimensions.get("window");

interface Obstacle {
  id: number;
  x: number;
  y: number;
  size: number;
}

const InfiniteDodgeGame: React.FC = () => {
  const [playerX, setPlayerX] = useState<number>(width / 2);
  const [score, setScore] = useState<number>(0);
  const [running, setRunning] = useState<boolean>(false);
  const [obstacles, setObstacles] = useState<Obstacle[]>(
    []
  );
  const touchActive = useRef<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (running) {
      interval = setInterval(() => {
        setScore((prev) => prev + 1);
        setObstacles(
          (prev) =>
            prev
              .map((obs) => ({ ...obs, y: obs.y + 10 })) // Move obstacles down
              .filter((obs) => obs.y < height) // Remove off-screen obstacles
        );
        spawnObstacle();
      }, 100);
    }
    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    if (running) {
      const collision = obstacles.some(
        (obs) =>
          Math.abs(obs.x - playerX) < obs.size / 2 &&
          obs.y > height - 120 // Only detect collision near the player, not the score text
      );
      if (collision || !touchActive.current) {
        gameOver();
      }
    }
  }, [obstacles, playerX]);

  const spawnObstacle = () => {
    if (Math.random() < 0.3) {
      const size = 30 + Math.random() * 40;
      setObstacles((prev) => [
        ...prev,
        {
          id: Date.now(),
          x: Math.random() * width,
          y: 0,
          size,
        },
      ]);
    }
  };

  const gameOver = () => {
    setRunning(false);
    Alert.alert("Game Over!", `Final Score: ${score}`, [
      { text: "Try Again", onPress: startGame },
    ]);
  };

  const startGame = () => {
    setScore(0);
    setObstacles([]);
    touchActive.current = true;
    setRunning(true);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      touchActive.current = true;
      if (!running) startGame();
    },
    onPanResponderMove: (_, gestureState) => {
      setPlayerX((prevX) =>
        Math.max(
          20,
          Math.min(width - 20, prevX + gestureState.dx)
        )
      ); // Allow full movement
    },
    onPanResponderRelease: () => {
      touchActive.current = false; // Lose if finger is lifted
    },
  });

  return (
    <View
      style={styles.container}
      {...panResponder.panHandlers}
    >
      <Text style={styles.score}>Score: {score}</Text>
      <Svg
        width={width}
        height={height}
        style={styles.gameArea}
      >
        <Circle
          cx={playerX}
          cy={height - 100}
          r={15}
          fill="blue"
        />
        {obstacles.map((obs) => (
          <Rect
            key={obs.id}
            x={obs.x}
            y={obs.y}
            width={obs.size}
            height={obs.size}
            fill="red"
          />
        ))}
      </Svg>
      {/* {!running && (
        <Text style={styles.tapText}>
          Touch and Hold to Start
        </Text>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#282c34",
  },
  score: {
    fontSize: 30,
    color: "white",
    position: "absolute",
    top: 50,
  },
  gameArea: {
    flex: 1,
    width: "100%",
  },
  tapText: {
    fontSize: 20,
    color: "white",
    position: "absolute",
    bottom: 100,
  },
});

export default InfiniteDodgeGame;
