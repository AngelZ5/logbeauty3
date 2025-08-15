import React, { useState, useEffect } from "react";
import { Star, Sparkles, Loader } from "lucide-react";
import { db } from "../firebaseConfig.js";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import Header from "./Header";
import AdminPanel from "./AdminPanel";

const ADMIN_PASSWORD = "2LOGA123";

const RatingStars = ({ rating }) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
        fill={i < rating ? "#FACC15" : "none"}
        strokeWidth={2}
      />
    );
  }
  return <div className="flex">{stars}</div>;
};

const PurchaseModal = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
      <h3 className="text-2xl font-bold text-pink-900 mb-4 text-center">
        Como comprar
      </h3>
      <p className="text-center text-gray-700 mb-6 text-lg">
        Dirija-se até o 2logA para comprar seu produto! Você será muito bem
        recebido.
      </p>
      <div className="flex justify-center">
        <button
          onClick={onClose}
          className="bg-pink-600 text-white px-6 py-2 rounded-full font-medium transition-colors duration-200 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
        >
          Entendi
        </button>
      </div>
    </div>
  </div>
);

function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  useEffect(() => {
    const savedAdminStatus = localStorage.getItem("isAdminLoggedIn");
    if (savedAdminStatus === "true") {
      setIsAdmin(true);
      setShowAdminPanel(true);
    }

    const productsCollectionRef = collection(db, "products");
    const q = query(productsCollectionRef, orderBy("name", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          price: Number(doc.data().price),
          rating: Number(doc.data().rating),
          stock: Number(doc.data().stock),
          isNew: Boolean(doc.data().isNew),
        }));
        setProducts(productsData);
        setLoading(false);
      },
      (error) => {
        console.error("Erro ao buscar produtos do Firestore:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setPasswordError("");

      if (rememberMe) {
        localStorage.setItem("isAdminLoggedIn", "true");
      }
    } else {
      setPasswordError("Senha incorreta.");
    }
  };

  const handleLoginClick = () => {
    setShowAdminPanel(true);
    setPassword("");
    setPasswordError("");
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setShowAdminPanel(false);
    setPassword("");
    localStorage.removeItem("isAdminLoggedIn");
  };

  const handlePurchaseClick = () => {
    setShowPurchaseModal(true);
  };

  const handleCloseModal = () => {
    setShowPurchaseModal(false);
  };

  const renderLoginForm = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-sm mx-auto mt-20">
      <h2 className="text-2xl font-bold text-pink-900 mb-6 text-center">
        Acesso Administrativo
      </h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Senha de Acesso
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
          />
          <label
            htmlFor="rememberMe"
            className="ml-2 block text-sm text-gray-900"
          >
            Lembrar-me
          </label>
        </div>

        {passwordError && (
          <p className="text-red-500 text-sm">{passwordError}</p>
        )}
        <button
          type="submit"
          className="w-full flex justify-center items-center space-x-2 bg-pink-600 text-white px-4 py-2 rounded-full font-medium transition-colors duration-200 hover:bg-pink-700"
        >
          <span>Entrar</span>
        </button>
      </form>
      <button
        onClick={handleLogout}
        className="mt-4 w-full flex justify-center items-center space-x-2 bg-gray-400 text-white px-4 py-2 rounded-full font-medium transition-colors duration-200 hover:bg-gray-500"
      >
        <span>Sair</span>
      </button>
    </div>
  );

  return (
    <>
      <Header
        isAdmin={isAdmin}
        onLoginClick={handleLoginClick}
        onLogout={handleLogout}
      />
      <div className="min-h-screen bg-pink-50 font-sans text-gray-800 p-4 sm:p-8 flex flex-col items-center mt-28">
        <main className="w-full max-w-7xl mx-auto">
          {showAdminPanel ? (
            isAdmin ? (
              <AdminPanel
                products={products}
                onBackToMarketplace={() => setShowAdminPanel(false)}
              />
            ) : (
              renderLoginForm()
            )
          ) : loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader size={64} className="animate-spin text-pink-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col transform hover:-translate-y-2 relative"
                  >
                    {product.isNew && (
                      <div className="absolute top-2 left-2 bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center space-x-1">
                        <Sparkles size={14} />
                        <span>Novo</span>
                      </div>
                    )}
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/400x300/F4D7DE/884455?text=Produto";
                      }}
                    />
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-xl font-semibold text-pink-900 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 flex-grow">
                        {product.description}
                      </p>
                      <div className="flex items-center mb-3">
                        <RatingStars rating={product.rating} />
                        <span className="ml-2 text-sm text-gray-500">
                          ({product.rating}.0)
                        </span>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-2xl font-bold text-pink-800">
                          R$ {product.price.toFixed(2).replace(".", ",")}
                        </span>
                        <button
                          onClick={handlePurchaseClick}
                          className="flex items-center space-x-2 bg-pink-600 text-white px-4 py-2 rounded-full font-medium transition-colors duration-200 hover:bg-pink-700"
                        >
                          <span>Comprar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600 col-span-full">
                  Nenhum produto encontrado. Adicione produtos na coleção
                  'products' do seu Firestore!
                </p>
              )}
            </div>
          )}
        </main>
      </div>
      {showPurchaseModal && <PurchaseModal onClose={handleCloseModal} />}
    </>
  );
}

export default Marketplace;
