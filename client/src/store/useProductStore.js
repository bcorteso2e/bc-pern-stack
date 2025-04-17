import { create } from 'zustand'
import axios from 'axios'
import toast from 'react-hot-toast'

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : ""

export const useProductStore = create((set,get) => ({
    products: [],
    loading: false,
    error: null,
    currentProduct: null,
    formData: {
        name: "",
        price: "",
        image: ""
    },

    fetchProducts: async () => {
        set({loading: true});

        try {
            const response = await axios.get(`${BASE_URL}/api/products`)
            set({products: response.data.data, error: null})
        } catch (err) {
            console.log(err);
            set({error: 'Something went wrong', products: []})
        } finally{
            set({loading: false})
        }
    },

    setFormData: (formData) => set({formData}),
    resetForm: () => set({ formData: {name: "", price: "", image: ""}}),

    addProduct: async(e) => {
        e.preventDefault();
        set({loading: true})
        try {
            const { formData } = get(); 
            await axios.post(`${BASE_URL}/api/products`, formData)
            await get().fetchProducts()
            toast.success('Product added successfully')
            document.getElementById('add_product_modal').close()
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong')
        } finally {
            set({loading: false})
        }
    },

    deleteProduct: async (id) => {
        set({loading: true});
        try {
            await axios.delete(`${BASE_URL}/api/products/${id}`)
            set(prev => ({products: prev.products.filter(product => product.id !== id)}))
            toast.success('Product deleted successfully')
        } catch (error) {
            console.log(error);
            toast.error('Someting went wrong')
        }finally{
            set({loading: false})
        }
    },

    fetchProduct: async (id) => {
        set({loading: true})

        try {
            const response = await axios.get(`${BASE_URL}/api/products/${id}`)
            set({
                currentProduct: response.data.data,
                formData: response.data.data,
                error: null
            })
        } catch (error) {
            console.log(error)
            set({error: 'Something went wrong', currentProduct: null})
        } finally{
            set({loading: false})
        }
    },


    updateProduct: async (id) => {
        set({loading: true})

        try {
            const { formData } = get()
            const response = await axios.put(`${BASE_URL}/api/products/${id}`, formData)
            set({
                currentProduct: response.data.data,
                error: null
            })
            toast.success('Product edited successfully')
        } catch (error) {
            console.log(error)
            set({error: 'Something went wrong', currentProduct: null})
        } finally{
            set({loading: false})
        }
    }

}))