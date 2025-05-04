import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import OverviewPage from "./pages/OverviewPage";
import MatchPage from "./pages/MatchPage";
import UtilisateurPage from "./pages/UtilisateurPage";
import VentesPage from "./pages/VentesPage";
import CommandePage from "./pages/CommandePage";
import ParametrePage from "./pages/ParametrePage";

function App() {
	return (
		<div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
			
			<div className='fixed inset-0 z-0 pointer-events-none'>
				<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
				<div className='absolute inset-0 backdrop-blur-sm' />
			</div>
			
			<Sidebar />
			
				<Routes>
					<Route path='/' element={<OverviewPage />} />
					<Route path='/matches' element={<MatchPage />} />
					<Route path='/users' element={<UtilisateurPage />} />
					<Route path='/ventes' element={<VentesPage />} />
					<Route path='/commande' element={<CommandePage />} />SyntaxError: The requested module '/src/components/matches/AddMatch.jsx?t=1746388208837' does not provide an export named 'AddMatch' (at MatchPage.jsx:10:10)
					<Route path='/parametre' element={<ParametrePage />} />
				</Routes>
			
		</div>
	);
}

export default App;
