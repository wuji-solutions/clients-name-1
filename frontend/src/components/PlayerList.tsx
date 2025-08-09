import React, { useEffect, useState } from "react";
import { BACKEND_ENDPOINT, BACKEND_ENDPOINT_EXTERNAL } from "../common/config";
import { styled } from "styled-components";
import { useSSEChannel } from "../providers/SSEProvider";

const Contaier = styled.div({
  marginTop: "auto",
  marginBottom: "auto",
  marginLeft: "20px",
  height: "88vh",
  width: "27%",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  border: `2px solid`,
  borderRadius: "5px",
});

const Header = styled.span({
  fontWeight: 700,
  fontSize: "22px",
  marginLeft: "auto",
  marginRight: "auto",
  marginTop: "15px",
  marginBottom: "25px",
});

const PlayerContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  textAlign: "center",
  overflowY: "auto",
  overflowX: "hidden",
});

const PlayerEntry = styled.span<{ isNew: boolean }>(({ isNew }) => ({
  display: "inline-block",
  transformOrigin: "center",
  animation: isNew ? "popin 0.3s ease forwards" : "none",
  "@keyframes popin": {
    "0%": {
      transform: "scale(0.5)",
      opacity: 0,
    },
    "60%": {
      transform: "scale(1.2)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(1)",
      opacity: 1,
    },
  },
}));

type Player = {
  index: number;
  nickname: string;
  details: any;
};

const addPlayers = (
  event: Player[],
  players: Player[],
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>,
  setNewPlayers: React.Dispatch<React.SetStateAction<Set<string>>>,
) => {
  try {
    const data: Player[] = event;

    const currentNicknames = new Set(players.map((p) => p.nickname));
    const addedPlayers = data.filter((p) => !currentNicknames.has(p.nickname));

    setPlayers(data);

    if (addedPlayers.length > 0) {
      setNewPlayers((prev) => {
        const updated = new Set(prev);
        addedPlayers.forEach((p) => updated.add(p.nickname));
        return updated;
      });

      setTimeout(() => {
        setNewPlayers((prev) => {
          const updated = new Set(prev);
          addedPlayers.forEach((p) => updated.delete(p.nickname));
          return updated;
        });
      }, 1500);
    }
  } catch (error) {
    console.error("Failed to fetch player list: ", error);
  }
};

function PlayerList({ user }: { readonly user: string }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayers, setNewPlayers] = useState<Set<string>>(new Set());
  const delegate = useSSEChannel(`${BACKEND_ENDPOINT}/sse/users`);

  useEffect(() => {
    const unsubscribe = delegate.on("player-list", (data) => {
      addPlayers(data, players, setPlayers, setNewPlayers);
    });
    return unsubscribe;
  }, [delegate]);

  return (
    <Contaier>
      <Header>Lista graczy</Header>
      <PlayerContainer>
        {players.map((player) => (
          <PlayerEntry
            key={player.nickname}
            isNew={newPlayers.has(player.nickname)}
          >
            {player.nickname}
          </PlayerEntry>
        ))}
      </PlayerContainer>
    </Contaier>
  );
}

export default PlayerList;
