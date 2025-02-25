import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { 
  Avatar,
  Box, 
  Button,
  Flex, 
  HStack,
  Text,
} from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';
import {
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
} from './ui/menu';
import CreateGameDialog from './CreateGameDialog';


const Navbar = () => {
  const [isCreateGameDialogOpen, setIsCreateGameDialogOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleCreateGame = () => {
    setIsCreateGameDialogOpen(true);
  };

  return (
    <>
      <Box 
        bg='bg.muted'
        px={4}
      >
        <Flex 
          h={16}
          alignItems='center'
          justifyContent='space-between'
        >
          <Text fontSize='2xl' fontWeight='bold'>
            Marbles
          </Text>
          {user && 
            <HStack>
              <Button
                padding={2}
                size='sm'
                aria-label='Create new game'
                onClick={handleCreateGame}
                mr={2}
              >
                <FaPlus /> Create new game
              </Button>
            
              <MenuRoot>
                <MenuTrigger asChild>
                  <Button
                    variant='ghost'
                    p={0}
                    border='none'
                    focusRing='none'
                  >
                    <Avatar.Root>
                      <Avatar.Image src={user?.picture} />
                      <Avatar.Fallback name={`${user?.firstName} ${user?.lastName}`} />
                    </Avatar.Root>
                  </Button>
                </MenuTrigger>
                <MenuContent
                  bg='gray'
                >
                  <MenuItem
                    onClick={handleLogout}
                  >
                    Logout
                  </MenuItem>
                </MenuContent>
              </MenuRoot>
            </HStack>
          }
        </Flex>
      </Box>
      <CreateGameDialog 
        isOpen={isCreateGameDialogOpen} 
        setIsOpen={setIsCreateGameDialogOpen}
      />
    </>
  );
};

export default Navbar; 