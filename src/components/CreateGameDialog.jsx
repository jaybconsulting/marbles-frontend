import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import PropTypes from 'prop-types';
import { 
    DialogBody,
    DialogRoot, 
    DialogContent, 
    DialogTitle, 
    DialogHeader,
} from './ui/dialog';
import { SkeletonText, SkeletonCircle } from './ui/skeleton';
import FriendList from './FriendList';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Button, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import FriendRow from './FriendRow';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { addFriend, removeFriend, sortFriendsWithUserOnTop } from '../utils/friends';

export default function CreateGameDialog({isOpen, setIsOpen}) {
    const [friends, setFriends] = useState([]);
    const { user } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const [isLoading, setIsLoading] = useState(false);

    const [selectedPlayers, setSelectedPlayers] = useState({
        green: {
            first_name: user?.first_name,
            last_name: user?.last_name,
            picture: user?.picture,
        },
        blue: {
            first_name: null,
            last_name: null,
            picture: null,
        },
        red: {
            first_name: null,
            last_name: null,
            picture: null,
        },
        yellow: {
            first_name: null,
            last_name: null,
            picture: null,
        },
    });
    
    useEffect(() => {
        const fetchFriends = async () => {
            setIsLoading(true);
            try {
                if (user) {
                    const friendsResponse = await axiosPrivate.get('/friends');
                    const friendsData = [...friendsResponse.data, user];
                    setFriends(sortFriendsWithUserOnTop(friendsData, user));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchFriends();
    }, [axiosPrivate, user]);

    const setNextPlayer = (player) => {
        for (const color in selectedPlayers) {
            if (!selectedPlayers[color].first_name) {
                setSelectedPlayers({
                    ...selectedPlayers,
                    [color]: player,
                });
                break;
            }
        }
        setFriends(sortFriendsWithUserOnTop(removeFriend(friends, player), user));
    }

    const removePlayer = (friend) => {
        const color = Object.keys(selectedPlayers).find(key => selectedPlayers[key].id === friend.id);
        setSelectedPlayers({
            ...selectedPlayers,
            [color]: {
                first_name: null,
                last_name: null,
                picture: null,
            },
        });
        setFriends(sortFriendsWithUserOnTop(addFriend(friends, friend), user));
    }

    const startGame = async () => {
        try {
            const game = await axiosPrivate.post('/game', {
                playerIds: {
                    green: selectedPlayers.green.id,
                    blue: selectedPlayers.blue.id,
                    red: selectedPlayers.red.id,
                    yellow: selectedPlayers.yellow.id,
                },
            })
            
            
        } catch (err) {
            console.error(err);
        }
    }
    

    const AddFriendButton = ({friend}) => {
        return (
            <Button
                size="sm"
                onClick={() => setNextPlayer(friend)}
            >
                <FaPlus />
            </Button>
        )
    }

    AddFriendButton.propTypes = {
        friend: PropTypes.object.isRequired,
    };

    const RemoveFriendButton = ({friend}) => {
        return (
            <Button
                size="sm"
                mr={10}
                onClick={() => removePlayer(friend)}
            >
                <FaMinus />
            </Button>
        )
    }

    RemoveFriendButton.propTypes = {
        friend: PropTypes.object.isRequired,
    };


    const PlayerSelector = ({color}) => {
        const player = selectedPlayers[color];
        return (
            !player?.first_name ? (
                <HStack
                    spacing={2}
                    p={3}
                    width="100%"
                >
                    <SkeletonCircle 
                        size="10"
                        variant="shine"
                        css={{
                            "--start-color": "var(--chakra-colors-bg-emphasized)",
                            "--end-color": "var(--chakra-colors-bg-emphasized)",
                        }}
                        mr={2}
                    />
                    <SkeletonText
                        noOfLines={1}
                        height="6"
                        width="200px"
                        variant="shine"
                        css={{
                            "--start-color": "var(--chakra-colors-bg-emphasized)",
                            "--end-color": "var(--chakra-colors-bg-emphasized)",
                        }}
                    />
                </HStack>
            ) : (
                <FriendRow 
                    friend={player} 
                    FriendButton={RemoveFriendButton}
                />
            )
        )
    }

    PlayerSelector.propTypes = {
        color: PropTypes.string.isRequired,
    };

    return (
        <DialogRoot 
            open={isOpen} 
            onOpenChange={e => setIsOpen(e.open)}
            colorPalette="blue"
            size="lg"
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle
                        fontSize="2xl"
                        display="flex"
                        justifyContent="center"
                    >
                        Create Game
                    </DialogTitle>
                    <VStack>
                        <Flex
                            justifyContent="space-between"
                            mt={3}
                            direction={['column', 'row']}
                        >
                            <VStack
                                width={['100%', '50%']}
                                mt={[3, 0]}
                            >
                                <Heading 
                                    size="md"
                                    mb={2}
                                >
                                    <Text as="span" color="green.500">Green</Text> / <Text as="span" color="blue.500">Blue</Text>
                                </Heading>
                                <PlayerSelector color="green" />
                                <PlayerSelector color="blue" />
                            </VStack>
                            <VStack
                                width={['100%', '50%']}
                                mt={[3, 0]}
                            >
                                <Heading 
                                    size="md"
                                    mb={2}
                                >
                                    <Text as="span" color="red.500">Red</Text> / <Text as="span" color="yellow.500">Yellow</Text>
                                </Heading>
                                <PlayerSelector color="red" />
                                <PlayerSelector color="yellow" />
                            </VStack>
                        </Flex>
                        <Button
                            size="sm"
                            mt={6}
                            onClick={startGame}
                        >
                            Start Game
                        </Button>
                    </VStack>
                </DialogHeader>
                <DialogBody>
                    <FriendList 
                        friends={friends} 
                        FriendButton={AddFriendButton}
                        isLoading={isLoading}
                    />
                </DialogBody>
            </DialogContent>
        </DialogRoot>
    );
}

CreateGameDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    setIsOpen: PropTypes.func.isRequired,
};