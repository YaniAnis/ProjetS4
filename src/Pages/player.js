import { useEffect, useState } from "react";

export const usePlayers = () => {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/api/players")
            .then((res) => res.json())
            .then((data) => setPlayers(data || []))
            .catch(() => setPlayers([]));
    }, []);

    return players;
};
