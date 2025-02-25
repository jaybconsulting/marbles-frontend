import PropTypes from 'prop-types';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import FriendRow from './FriendRow';

export default function FriendList({friends, FriendButton}) {
    return (
        <Box
            mt={4}
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
                    {friends && friends.length > 0 ? (
                        friends.map((friend) => (
                            <FriendRow 
                                key={friend.id} 
                                friend={friend} 
                                FriendButton={FriendButton}
                            />
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
    );
}

FriendList.propTypes = {
    friends: PropTypes.array.isRequired,
    FriendButton: PropTypes.func.isRequired,
};