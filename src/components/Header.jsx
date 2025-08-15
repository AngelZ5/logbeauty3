import React from "react";
import { LogIn, LogOut, Search, Star } from "lucide-react";

const Header = ({ isAdmin, onLoginClick, onLogout }) => {
  return (
    <header className="w-full bg-pink-50 p-4 md:p-8 flex justify-between items-center fixed top-0 left-0 right-0 z-50 shadow-md">
      {/* Nome do Marketplace */}
      <h1 className="text-2xl md:text-3xl font-bold text-pink-800 tracking-wide">
        LogBeauty
      </h1>

      {/* Barra de Pesquisa */}
      <div className="hidden md:flex flex-grow max-w-md mx-8 items-center bg-white rounded-full shadow-inner p-2 border border-gray-200">
        <Search size={20} className="text-gray-400 mx-2" />
        <input
          type="text"
          placeholder="Pesquisar produtos..."
          className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Ícones de Navegação e Botões de Login/Logout */}
      <div className="flex items-center space-x-4">
        {/* Ícone Estrela - substitui o perfil do usuário */}
        <button className="p-2 rounded-full text-pink-600 hover:bg-pink-100 transition-colors duration-200">
          <Star size={24} />
        </button>

        {/* Botão de Login/Logout para o Painel Admin */}
        {isAdmin ? (
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 bg-pink-600 text-white px-4 py-2 rounded-full font-medium transition-colors duration-200 hover:bg-pink-700"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        ) : (
          <button
            onClick={onLoginClick}
            className="flex items-center space-x-2 bg-pink-600 text-white px-4 py-2 rounded-full font-medium transition-colors duration-200 hover:bg-pink-700"
          >
            <LogIn size={18} />
            <span className="hidden sm:inline">Painel Admin</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
