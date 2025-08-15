import React, { useState } from "react";
import {
  Loader,
  PlusCircle,
  LayoutGrid,
  Trash2,
  Pencil,
  XCircle,
} from "lucide-react";
import { db, storage } from "../firebaseConfig.js";
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

function AdminPanel({ products, onBackToMarketplace }) {
  const [isAddingOrUpdating, setIsAddingOrUpdating] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageInputType, setImageInputType] = useState("link");

  const [formProduct, setFormProduct] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    imageFile: null,
    rating: 0,
    isNew: false,
    stock: 0,
  });

  const handleAddOrUpdateProduct = async (e) => {
    e.preventDefault();
    setIsAddingOrUpdating(true);

    let finalImageUrl = formProduct.imageUrl;

    if (imageInputType === "upload" && formProduct.imageFile) {
      try {
        const imageRef = ref(
          storage,
          `images/${formProduct.imageFile.name + uuidv4()}`
        );
        await uploadBytes(imageRef, formProduct.imageFile);
        finalImageUrl = await getDownloadURL(imageRef);
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        setIsAddingOrUpdating(false);
        return;
      }
    }

    try {
      const productData = {
        ...formProduct,
        price: parseFloat(formProduct.price),
        rating: Number(formProduct.rating),
        stock: Number(formProduct.stock),
        imageUrl: finalImageUrl,
      };

      if (editingProduct) {
        const productRef = doc(db, "products", editingProduct.id);
        await updateDoc(productRef, productData);
        console.log("Produto atualizado com sucesso!");
      } else {
        await addDoc(collection(db, "products"), productData);
        console.log("Produto adicionado com sucesso!");
      }

      setEditingProduct(null);
      setFormProduct({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        imageFile: null,
        rating: 0,
        isNew: false,
        stock: 0,
      });
      setImageInputType("link");
    } catch (error) {
      console.error("Erro ao salvar o produto:", error);
    } finally {
      setIsAddingOrUpdating(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      imageFile: null,
      rating: product.rating,
      isNew: product.isNew,
      stock: product.stock,
    });
    setImageInputType("link");
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Tem certeza que deseja deletar este produto?")) {
      try {
        const productRef = doc(db, "products", productId);
        await deleteDoc(productRef);
        console.log("Produto deletado com sucesso!");
      } catch (error) {
        console.error("Erro ao deletar o produto:", error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setFormProduct({
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      imageFile: null,
      rating: 0,
      isNew: false,
      stock: 0,
    });
    setImageInputType("link");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-pink-900">
          {editingProduct ? "Editar Produto" : "Adicionar Novo Produto"}
        </h2>
        <button
          onClick={onBackToMarketplace}
          className="flex items-center space-x-2 bg-gray-500 text-white px-3 py-1 rounded-full font-medium transition-colors duration-200 hover:bg-gray-600 focus:outline-none"
        >
          <LayoutGrid size={16} />
          <span>Ver Produtos</span>
        </button>
      </div>

      <form
        onSubmit={handleAddOrUpdateProduct}
        className="space-y-4 mb-8 border-b pb-8"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nome do Produto
          </label>
          <input
            type="text"
            value={formProduct.name}
            onChange={(e) =>
              setFormProduct({ ...formProduct, name: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descrição
          </label>
          <textarea
            value={formProduct.description}
            onChange={(e) =>
              setFormProduct({ ...formProduct, description: e.target.value })
            }
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
            required
          ></textarea>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Preço (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={formProduct.price}
              onChange={(e) =>
                setFormProduct({ ...formProduct, price: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Avaliação (1-5)
            </label>
            <input
              type="number"
              value={formProduct.rating}
              onChange={(e) =>
                setFormProduct({ ...formProduct, rating: e.target.value })
              }
              min="0"
              max="5"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Método da Imagem
          </label>
          <div className="flex space-x-4 mb-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="image-type"
                value="link"
                checked={imageInputType === "link"}
                onChange={() => setImageInputType("link")}
                className="form-radio text-pink-600"
              />
              <span className="ml-2 text-gray-700">Link (URL)</span>
            </label>
          </div>

          {imageInputType === "link" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                URL da Imagem
              </label>
              <input
                type="text"
                value={formProduct.imageUrl}
                onChange={(e) =>
                  setFormProduct({ ...formProduct, imageUrl: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                required={!editingProduct} // É obrigatório apenas para novos produtos
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Arquivo de Imagem
              </label>
              <input
                type="file"
                accept=".png, .jpg, .jpeg"
                onChange={(e) =>
                  setFormProduct({
                    ...formProduct,
                    imageFile: e.target.files[0],
                  })
                }
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                required={!editingProduct && imageInputType === "upload"}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formProduct.isNew}
              onChange={(e) =>
                setFormProduct({ ...formProduct, isNew: e.target.checked })
              }
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              É um produto novo?
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Estoque
            </label>
            <input
              type="number"
              value={formProduct.stock}
              onChange={(e) =>
                setFormProduct({ ...formProduct, stock: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              required
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="flex-1 flex justify-center items-center space-x-2 bg-pink-600 text-white px-4 py-2 rounded-full font-medium transition-colors duration-200 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:bg-pink-400"
            disabled={isAddingOrUpdating}
          >
            {isAddingOrUpdating ? (
              <Loader size={18} className="animate-spin" />
            ) : (
              <>
                {editingProduct ? (
                  <Pencil size={18} />
                ) : (
                  <PlusCircle size={18} />
                )}
                <span>
                  {editingProduct ? "Salvar Edição" : "Adicionar Produto"}
                </span>
              </>
            )}
          </button>
          {editingProduct && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="flex-1 flex justify-center items-center space-x-2 bg-gray-400 text-white px-4 py-2 rounded-full font-medium transition-colors duration-200 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              <XCircle size={18} />
              <span>Cancelar</span>
            </button>
          )}
        </div>
      </form>

      <h3 className="text-xl font-bold text-pink-900 mb-4">
        Lista de Produtos
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preço
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estoque
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  R$ {product.price.toFixed(2).replace(".", ",")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.stock > 0 ? (
                    product.stock
                  ) : (
                    <span className="text-red-500">Esgotado</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Editar"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Deletar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPanel;
