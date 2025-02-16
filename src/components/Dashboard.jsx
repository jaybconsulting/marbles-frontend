import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { 
    Avatar,
    Box, 
    Button,
    Container, 
    Heading, 
    Stat, 
    Text,
    VStack,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

export default function Dashboard() {
    const { user } = useContext(UserContext);

    const StatBox = ({ label, value, color }) => (
        <Box 
            p={4} 
            bg="bg.muted"
            borderRadius="lg" 
            flex="1"
            minW="200px"
        >
            <Stat.Root>
                <Stat.Label fontSize="md" color={color}>{label}</Stat.Label>
                <Stat.ValueText fontSize="3xl">
                    {value || 0}
                </Stat.ValueText>
            </Stat.Root>
        </Box>
    );
    
    StatBox.propTypes = {
        label: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        color: PropTypes.string.isRequired,
    };

    const FriendRow = ({ friend }) => (
        <Box
            display="flex"
            alignItems="center"
            p={3}
            width="100%"
        >
            <Avatar
                src={friend.profilePicture || 'default-avatar.png'}
                alt={`${friend.firstName}'s profile`}
                boxSize="40px"
                borderRadius="full"
                mr={4}
            />
            <Text flex="1">{friend.firstName} {friend.lastName}</Text>
            <Button
                colorScheme="blue"
                size="sm"
            >
                Invite to a new game
            </Button>
        </Box>
    );

    FriendRow.propTypes = {
        friend: PropTypes.shape({
            firstName: PropTypes.string.isRequired,
            lastName: PropTypes.string.isRequired,
            profilePicture: PropTypes.string,
        }).isRequired,
    };

    return (
        <Container maxW="container.xl" py={8}>
            <Heading 
                mb={6} 
                size="4xl"
                textAlign="center"
            >
                Welcome, {user.firstName}!
            </Heading>
            <Box
                display="flex"
                flexDirection="row"
                gap={4}
                flexWrap="wrap"
                p={6}
            >
                <StatBox label="Wins" value={user.wins || 0} color="green.500" />
                <StatBox label="Losses" value={user.losses || 0} color="red.500" />
                <StatBox label="Total Games" value={(user.wins || 0) + (user.losses || 0)} color="blue.500" />
                <StatBox label="Win Rate" value={user.wins || user.losses ? `${Math.round((user.wins / (user.wins + user.losses)) * 100)}%` : '0%'} color="purple.500" />
            </Box>

            <Box
                mt={8}
                mx={6}
                p={6}
                bg="bg.muted"
                borderRadius="lg"
            >
                <Heading
                    size="lg"
                    mb={4}
                >
                    Friends
                </Heading>
                <Box
                    maxH="400px"
                    overflowY="auto"
                    css={{
                        '&::-webkit-scrollbar': {
                            width: '4px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: 'rgba(0, 0, 0, 0.1)',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '2px',
                        },
                    }}
                >
                    <VStack spacing={0} align="stretch">
                        {user.friends && user.friends.length > 0 ? (
                            user.friends.map((friend) => (
                                <FriendRow key={friend.id} friend={friend} />
                            ))
                        ) : (
                            <Text 
                                p={4} 
                                textAlign="center"
                            >
                                No friends added yet
                            </Text>
                        )}
                    </VStack>
                </Box>
            </Box>
        </Container>
    );
}