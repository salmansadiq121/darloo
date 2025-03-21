"use client";
import { useState, useEffect, useContext, createContext } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { productsURI } from "../utils/ServerURI";
import { useQuery } from "@tanstack/react-query";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [showAuth, setShowAuth] = useState(false);
  const [activationCode, setActivationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState([]);

  console.log("selectedProduct:", selectedProduct);

  //   Token Check
  axios.defaults.headers.common["Authorization"] = auth.token;

  useEffect(() => {
    const data = localStorage.getItem("ayoobinfo");
    const token = Cookies.get("ayoobtoken");

    if (data) {
      const parseData = JSON.parse(data);
      setAuth((prevAuth) => ({
        ...prevAuth,
        user: parseData?.user,
        token: token,
      }));
    }
  }, []);

  //   Check Expiry token

  // Fetch All Products
  const fetchProducts = async () => {
    const { data } = await axios.get(`${productsURI}/all/products`);
    return data.products;
  };

  const { data: products, isFetching } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setSelectedProduct(JSON.parse(savedCart));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        showAuth,
        setShowAuth,
        activationCode,
        setActivationCode,
        isLoading,
        setIsLoading,
        search,
        setSearch,
        products: products || [],
        isFetching,
        selectedProduct,
        setSelectedProduct,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
