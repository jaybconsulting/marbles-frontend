import PropTypes from 'prop-types';
import { 
    Avatar,
    Box,
    Button,
    Text,
} from '@chakra-ui/react';

export default function FriendRow({friend}) {
    return (
        <Box
            display="flex"
            alignItems="center"
            p={3}
            width="100%"
        >
            <Avatar.Root
                boxSize="40px"
                borderRadius="full"
                mr={4}
            >
                <Avatar.Fallback
                    name={`${friend.firstName} ${friend.lastName}`}
                />
                <Avatar.Image
                    src={friend.picture}
                    alt={`${friend.firstName}'s profile`}
                />
            </Avatar.Root>
            <Text flex="1">{friend.firstName} {friend.lastName}</Text>
            <Button
                colorScheme="blue"
                size="sm"
            >
                Invite to a new game
            </Button>
        </Box>
    );
}

FriendRow.propTypes = {
    friend: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        picture: PropTypes.string,
    }).isRequired,
};