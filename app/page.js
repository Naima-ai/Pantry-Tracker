'use client'
import React, { useEffect, useState } from "react";
import { Box, Stack, Typography, Button, Modal, TextField } from "@mui/material";
import { collection, query, doc, getDocs, setDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "@/firebase";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from 'axios';


const theme = createTheme({
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
    },
    h4: {
      fontWeight: 500,
      fontSize: "1.5rem",
    },
    body1: {
      fontSize: "1rem",
    },
  },
  palette: {
    primary: {
      main: "#4CAF50", // Gre color
    },
    secondary: {
      main: "#CC313D", // Ora color
    },
    background: {
      default: "#F9E795", //yellow background
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
      },
    },
  },
});

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [filteredPantry, setFilteredPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [openAddImage, setOpenAddImage] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [editOpen, setEditOpen] = useState(false); 
  


  const handleOpen = () => setOpen(true);
  const handleOpenAddImage = () => setOpenAddImage(true);
  const handleClose = () => setOpen(false);
  const handleimgClose = () => {
    setOpen(false);
    setImageSrc('');
    setItemName('');
    setItemQuantity('');
    setIsAnalyzing(false);
  };
  const handleEditOpen = (item) => {
    setEditItem(item);
    setItemName(item.name);
    setItemQuantity(item.quantity);
    setEditOpen(true);
  };
  const handleEditClose = () => setEditOpen(false);
  
  

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      const data = doc.data();
      pantryList.push({ name: doc.id, imageUrl: data.imageUrl, quantity: data.quantity || 1 });
    });
    setPantry(pantryList);
    setFilteredPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const additem = async (item,quantity) => {
    try {
      // Fetch image from Unsplash
      const response = await axios.get(`https://api.unsplash.com/search/photos`, {
      params: { query: item, client_id: '9z8OvYMRArhAG9YLKwr7hDIOFAUGl4mwKwhfECZLRfk' }
      });
      const imageUrl = response.data.results[0]?.urls.small || '';
  
      // Store item and image URL in Firestore
      const docRef = doc(collection(firestore, 'pantry'), item);
      await setDoc(docRef, { name: item, imageUrl, quantity });
  
      updatePantry();
    } catch (error) {
      console.error("Error adding item: ", error);
    }
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    await deleteDoc(docRef);
    updatePantry();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === "") {
      setFilteredPantry(pantry);
    } else {
      const filtered = pantry.filter((item) =>
        item.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredPantry(filtered);
    }
  };
  const updateItem = async () => {
    try {
      const docRef = doc(collection(firestore, 'pantry'), editItem.name);
      await setDoc(docRef, { name: itemName, quantity: itemQuantity }, { merge: true });
      updatePantry();
      handleEditClose();
    } catch (error) {
      console.error("Error updating item: ", error);
    }
  };
  const handleAddItemWithImage = async () => {
    if (isAnalyzing) {
      // Wait until image analysis is complete
      return;
    }
    await additem(itemName, itemQuantity);
    handleClose();
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        width="100vw"
        height="100vh"
        
        bgcolor="background.default"
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        gap={2}
        padding={4}
      >
        <Typography variant="h2" color={'#333'} textAlign={'center'}>
          Welcome to the Pantry Store!
        </Typography>
        <TextField
                variant="outlined"
                placeholder="Search items..."
                fullWidth
                value={searchTerm}
                onChange={handleSearch}
                sx={{
                  maxWidth: '600px',
                  marginBottom: 2,
                  backgroundColor: 'white', 
                  borderRadius: 1, 
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.5)', // Darken the border color
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.5)', // Darken the border color on hover
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#333', 
                    },
                  },
                }}
              />

        <Button variant="contained" color="primary" onClick={handleOpen}>
          ADD
        </Button>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Item
            </Typography>
            <Stack width="100%" direction={'row'} spacing={2}>
              <TextField
                id="outlined-basic"
                label="Items"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <TextField
                id="outlined-basic"
                label="Quantity"
                variant="outlined"
                fullWidth
                value={itemQuantity}
                onChange={(e) => setItemQuantity(e.target.value)}
              />
              <Button variant="contained" color="primary" onClick={() => {
                additem(itemName,itemQuantity);
                setItemName('');
                setItemQuantity('');
                handleClose();
              }}>Add</Button>
            </Stack>
          </Box>
        </Modal>
      
        <Modal
          open={editOpen}
          onClose={handleEditClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Edit Item
            </Typography>
            <Stack width="100%" direction={'row'} spacing={2}>
              <TextField
                id="outlined-basic"
                label="Items"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <TextField
                id="outlined-basic"
                label="Quantity"
                variant="outlined"
                fullWidth
                value={itemQuantity}
                onChange={(e) => setItemQuantity(e.target.value)}
              />
              <Button variant="contained" color="primary" onClick={updateItem}>
                Save
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Box border={'1px solid #333'} width="800px">
          <Box width="100%" height="100px" bgcolor={'#FFD580'} 
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
              Available Pantry Items
            </Typography>
          </Box>
          <Stack
            width="100%"
            height="300px"
            spacing={2}
            overflow={'auto'}
          >
            {filteredPantry.length > 0 ? (
              filteredPantry.map((item) => (
                <Box
                  key={item.name}
                  width="100%"
                  minHeight="150px"
                  display={'flex'}
                  justifyContent={'space-between'}
                  paddingX={2}
                  alignItems={'center'}
                  bgcolor={'#f0f0f0'}
                >
                  <img src={item.imageUrl} alt={item.name} style={{ width: '100px', height: '100px', marginRight: '10px' }} />
                  <Typography
                    variant={'h4'}
                    color={'#333'}
                    textAlign={'center'}
                    fontWeight={'bold'}
                  >
                    {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                  </Typography>
                  <Typography
                      variant={'body1'}
                      color={'#555'}
                      textAlign={'center'}
                    >
                      Quantity: {item.quantity}
                    </Typography>
                  <Button variant="contained" color="primary" onClick={() => handleEditOpen(item)}> Edit </Button>
                  <Button variant="contained" color="secondary" onClick={() => removeItem(item.name)}> Delete</Button>
                </Box>
              ))
            ) : (
              <Typography variant="h6" color={'#333'} textAlign={'center'} padding={2}>
                Item not available in the list.
              </Typography>
            )}
          </Stack>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
