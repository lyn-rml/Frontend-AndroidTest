import React, { useEffect, useMemo, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const DEFAULT_ASPECT_RATIO = 16 / 9;

export default function ResponsiveRemoteImage({
  uri,
  minHeight = 160,
  maxHeight = 420,
  style,
  imageStyle,
}) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(DEFAULT_ASPECT_RATIO);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setAspectRatio(DEFAULT_ASPECT_RATIO);
    setHasError(false);
  }, [uri]);

  const resolvedHeight = useMemo(() => {
    if (!containerWidth || !aspectRatio) return minHeight;

    const naturalHeight = containerWidth / aspectRatio;
    return Math.max(minHeight, Math.min(naturalHeight, maxHeight));
  }, [aspectRatio, containerWidth, maxHeight, minHeight]);

  if (!uri) return null;

  return (
    <View
      style={[
        styles.frame,
        style,
        {
          minHeight,
          maxHeight,
        },
      ]}
      onLayout={(event) => {
        const nextWidth = event?.nativeEvent?.layout?.width || 0;
        if (nextWidth && nextWidth !== containerWidth) {
          setContainerWidth(nextWidth);
        }
      }}
    >
      {hasError ? (
        <View style={[styles.image, styles.fallback, { height: resolvedHeight }]}>
          <Text style={styles.fallbackText}>Image indisponible</Text>
        </View>
      ) : (
        <Image
          source={{ uri }}
          style={[styles.image, { height: resolvedHeight }, imageStyle]}
          resizeMode="contain"
          onLoad={(event) => {
            const source = event?.nativeEvent?.source;
            if (source?.width && source?.height) {
              setAspectRatio(source.width / source.height);
            }
          }}
          onError={() => {
            setHasError(true);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#EEE",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
  },
  fallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D8D8D8",
  },
  fallbackText: {
    color: "#555",
    fontWeight: "700",
  },
});
