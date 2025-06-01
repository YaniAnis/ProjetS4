import { useEffect, useState } from "react";

export const usePlayers = () => {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/api/players")
            .then((res) => res.json())
            .then((data) => {
                // Utilise image_url si présent, sinon construit à partir de image
                const mapped = (data || []).map(p => ({
                    ...p,
                    image_url: p.image_url
                        ? p.image_url
                        : (p.image ? `/storage/${p.image}` : null)
                }));
                setPlayers(mapped);
            })
            .catch(() => setPlayers([]));
    }, []);

    return players;
};
