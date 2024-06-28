import React from 'react';
import Link from 'next/link'; // Import Link from next/link for Next.js
import { useRouter } from 'next/router'; // Import useRouter from next/router for Next.js
import styles from '../../styles/Navbar.module.css'; // Adjust the path as per your project structure
import { Button } from '@mui/material';
const Navbar = () => {
  const router = useRouter();

  const handleCreatePost = () => {
    router.push('/createpost');
  };

  return (
    <div className={styles.left}>
      <div>
      
      </div>
      <div className={styles.right}>
        <Button onClick={handleCreatePost} className='btn btn-primary' variant="contained">Create Post</Button>
      </div>
    </div>
  );
}

export default Navbar;
