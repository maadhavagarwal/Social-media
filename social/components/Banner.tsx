import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import styles from "@/styles/Home.module.css";
import { io } from 'socket.io-client';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Avatar,
  Button,
} from '@mui/material';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface Product {
  _id: string;
  name: string;
  date: string;
  image: string;
  likes: number;
  comments: string[];
}

interface ExpandMoreProps extends React.ComponentProps<typeof IconButton> {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const socket = io('http://localhost:4000');

const RecipeReviewCard: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [like,setLike]=useState(false)
  const [like1,setLike1]=useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:4000/allproducts');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
    // Socket.IO event listeners
    socket.on('update', ({ productId, likes, comments }) => {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId ? { ...product, likes, comments } : product
        )
      );
    });

    return () => {
      socket.off('update');
    };
  }, []);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleLike = (productId: string) => {
    setLike(true)
    if (!like){
      socket.emit('like', productId);
      setLike(false)
    }
      if(like1){
        let d=document.getElementById("likeid")
        console.log(d)
        d.style.color="gray"
        setLike1(false)
      }
      if(!like1){
        let d=document.getElementById("likeid")
        console.log(d)
        d.style.color="red"
        setLike1(true)
      }
   
  };

  const handleComment = (productId: string, comment: string) => {
    socket.emit('comment', { productId, comment });
  };

  return (
    <div>
      {products.map((product) => (
        <Card key={product._id} sx={{ maxWidth: 455, mb: 1 }}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                {product.name.charAt(0)}
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title={product.name}
            subheader={product.date}
          />
          <CardMedia
            component="img"
            height="194"
            image={product.image || 'placeholder_image_url'}
            alt="Product image"
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {/* Additional content */}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>

            <IconButton aria-label="add to favorites" onClick={() => handleLike(product._id) }>
              
            <FavoriteIcon id='likeid' />
            </IconButton>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
             </CardActions>
          <CardContent>
          <Typography variant="body2" color="text.secondary">
            likes{product.likes}</Typography>
            <Typography variant="body2" color="text.secondary">
              Comments: {product.comments.length}
            </Typography>
            {product.comments.map((comment, index) => (
              <Typography key={index} variant="body2" color="text.secondary">
                {comment}
              </Typography>
            ))}
            <input type="text"  placeholder="Add a comment" />
            <Button onClick={(e) => handleComment(product._id, e.target.value)}>Add commet</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RecipeReviewCard;
