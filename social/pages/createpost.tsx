import React, { useState } from 'react';
import Upload from '../components/download.png';
import { Button, TextField, Typography, IconButton, InputAdornment } from '@mui/material';
import { Box } from '@mui/system';
import styles from '../styles/Home.module.css';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Toast } from 'react-toastify/dist/components';
import { toast } from 'react-toastify';
import { log } from 'console';
import { Router, useRouter } from 'next/router';

const CreatePost = () => {
  const router = useRouter()
  const [image, setImage] = useState<File | null>(null);
  const [productD, setProductD] = useState({ name: "", image: "" });
  // let Navigate=useNavigate()
  const imageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductD({ ...productD, [e.target.name]: e.target.value });
  };

  const addProduct = async () => {
    try {
      let response;
      let formData = new FormData();
      formData.append('product', image as Blob);

      response = await fetch("http://localhost:4000/upload", {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      }).then(res => res.json());

      if (response.success) {
        const updatedProduct = { ...productD, image: response.image_url };
        const addProductResponse = await fetch('http://localhost:4000/addproduct', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedProduct),
        }).then(resp => resp.json());

        if (addProductResponse){
          alert("Uploaded")
          router.push("/homepage")
                    
        }
        else{
          alert("Error")
        }
      }
    } catch (error) {
      console.error("Error uploading product:", error);
      alert("An error occurred while adding the product.");
    }
  };

  return (
    <div className={styles.center}>
      <div className="addproduct-itemfield">
        <Typography variant="h6">Post </Typography>
        <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="filled-basic"
            label="Account Name"
            variant="filled"
            name="name"
            value={productD.name}
            onChange={changeHandler}
            fullWidth
          />
          <TextField
            label="Upload Image"
            variant="filled"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <label htmlFor="fileinput">
                    <IconButton
                      color="primary"
                      component="span"
                    >
                      <CloudUploadIcon />
                    </IconButton>
                  </label>
                </InputAdornment>
              ),
              readOnly: true, // Make the text field read-only
            }}
            value={image ? image.name : ''}
          />
          <input
            onChange={imageHandler}
            type='file'
            name="image"
            id='fileinput'
            hidden
          />
          <Button
            variant="contained"
            onClick={addProduct}
            className='addproduct-upload'
          >
            ADD
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default CreatePost;
