import { useEffect, useState } from 'react';
import { 
    Box, 
    Button,
    Container, 
    Heading, 
    Stat, 
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import FriendList from './FriendList';
import { sortFriends } from '../utils/friends';

export default function Dashboard() {
    const axiosPrivate = useAxiosPrivate();

    const [stats, setStats] = useState({
        wins: 0,
        losses: 0,
    });

    const [friends, setFriends] = useState([]);

    const fetchWinLossStats = async () => {
        try {
            const response = await axiosPrivate.get('/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats: ', error);
        }
    };

    useEffect(() => {
        fetchWinLossStats();
    }, []);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await axiosPrivate.get('/friends');
                setFriends(sortFriends(response.data));
            } catch (error) {
                console.error('Error fetching friends: ', error);
            }
        };

        fetchFriends();
    }, []);

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

    const FriendButton = ({friend}) => {
        return (
            <Button
                size="sm"
            >
                Invite to a new game
            </Button>
        )
    }

    return (
        <Container maxW="container.xl" py={8}>
            <Heading 
                mb={6} 
                size="4xl"
                textAlign="center"
            >
                Dashboard
            </Heading>
            <Box
                display="flex"
                flexDirection="row"
                gap={4}
                flexWrap="wrap"
                p={6}
            >
                <StatBox label="Wins" value={stats.wins || 0} color="green.500" />
                <StatBox label="Losses" value={stats.losses || 0} color="red.500" />
                <StatBox label="Total Games" value={(stats.wins || 0) + (stats.losses || 0)} color="blue.500" />
                <StatBox label="Win Rate" value={stats.wins || stats.losses ? `${Math.round((stats.wins / (stats.wins + stats.losses)) * 100)}%` : '0%'} color="purple.500" />
            </Box>

            <FriendList 
                friends={friends} 
                FriendButton={FriendButton}
            />
        </Container>
    );
}