import { useEffect, useState } from "react";

export const usePlayers = () => {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/api/players")
            .then((res) => res.json())
            .then((data) => {
                // Map image path if present
                const mapped = (data || []).map(p => ({
                    ...p,
                    image: p.image ? `/storage/${p.image}` : null
                }));
                setPlayers(mapped);
            })
            .catch(() => setPlayers([]));
    }, []);

    return players;
};
