import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [credit, setCredit] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  console.log("Razorpay Key:", import.meta.env.VITE_RAZORPAY_KEY_ID)
  const navigate = useNavigate();

  const loadCreditsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/credits", {
        headers: { token },
      });

      if (data.success) {
        setCredit(data.credits);
        setUser(data.user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const generateImage = async (prompt) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/image/generate",
        { prompt },
        { headers: { token } }
      );

      if (data.success) {
        loadCreditsData();
        return data.resultImage;
      } else {
        toast.error(data.message);
        loadCreditsData();

        if (data.creditBalance === 0) {
          navigate("/buy");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserImages = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/image/history", {
        headers: { token },
      });

      if (data.success) {
        return data.images;
      } else {
        toast.error(data.message);
        return [];
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      return [];
    }
};
const deleteImage = async (imageId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/image/delete",
        { imageId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      return false;
    }
};

const removeBg = async (imageFile) => {
    try {
      const formData = new FormData()
      formData.append('image', imageFile)

      const { data } = await axios.post(
        backendUrl + "/api/image/remove-bg",
        formData,
        { headers: { token } }
      );

      if (data.success) {
        loadCreditsData();
        return data.resultImage;
      } else {
        toast.error(data.message);
        loadCreditsData();

        if (data.creditBalance === 0) {
          navigate("/buy");
        }
        return null;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      return null;
    }
};

const compressImage = async (imageFile, quality = 70) => {
    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      formData.append('quality', quality)

      const { data } = await axios.post(
        backendUrl + "/api/image/compress",
        formData
      );

      if (data.success) {
        return data;
      } else {
        toast.error(data.message);
        return null;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      return null;
    }
};

const imagesToPdf = async (imageFiles) => {
    try {
      const formData = new FormData()
      imageFiles.forEach(file => formData.append('images', file))

      const { data } = await axios.post(
        backendUrl + "/api/image/to-pdf",
        formData
      );

      if (data.success) {
        return data.resultPdf;
      } else {
        toast.error(data.message);
        return null;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      return null;
    }
};
  const initPay = async (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Credits Payment",
      description: "Credits Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backendUrl + "/api/user/verify-razorpay",
            response,
            { headers: { token } }
          );

          if (data.success) {
            loadCreditsData();
            navigate("/");
            toast.success("Credits Added");
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const paymentRazorpay = async (planId) => {
    try {
      if (!user) {
        setShowLogin(true);
        return;
      }

      const { data } = await axios.post(
        backendUrl + "/api/user/pay-razorpay",
        { planId },
        { headers: { token } }
      );

      if (data.success) {
        initPay(data.order);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  useEffect(() => {
    if (token) {
      loadCreditsData();
    }
  }, [token]);


  const toggleFavorite = async (imageId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/image/favorite",
        { imageId },
        { headers: { token } }
      );

      if (data.success) {
        return data.favorite;
      } else {
        toast.error(data.message);
        return null;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      return null;
    }
};


  const value = {
    user,
    setUser,
    showLogin,
    setShowLogin,
    backendUrl,
    token,
    setToken,
    credit,
    setCredit,
    loadCreditsData,
    logout,
    generateImage,
    paymentRazorpay,
    getUserImages,
    navigate,
    deleteImage,
    removeBg,
    compressImage,
    imagesToPdf,
    toggleFavorite,
};
  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;