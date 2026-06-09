import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { FAB, Card, Text, Chip, Searchbar, Menu, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { goalService } from '../../services/goalService';
import { Goal, GoalStatus } from '../../types';
import { format } from 'date-fns';

export default function GoalsScreen() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [statusFilter, setStatusFilter] = useState<GoalStatus | undefined>();
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();

  const loadGoals = useCallback(async (pageNum = 0, reset = false) => {
    try {
      setLoading(true);
      const response = await goalService.getAll(pageNum, 20, 'createdAt', 'DESC');
      
      if (reset) {
        setGoals(response.content);
      } else {
        setGoals((prev) => [...prev, ...response.content]);
      }
      
      setHasMore(!response.last);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadGoals(0, true);
  }, [loadGoals]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadGoals(0, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadGoals(page + 1, false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await goalService.search({
        search: searchQuery || undefined,
        status: statusFilter,
        page: 0,
        size: 20,
      });
      setGoals(response.content);
      setHasMore(!response.last);
    } catch (error) {
      console.error('Error searching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: GoalStatus) => {
    switch (status) {
      case GoalStatus.COMPLETED:
        return '#4caf50';
      case GoalStatus.IN_PROGRESS:
        return '#2196f3';
      case GoalStatus.CANCELLED:
        return '#f44336';
      default:
        return '#757575';
    }
  };

  const renderGoal = ({ item }: { item: Goal }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('GoalDetail' as never, { goalId: item.id } as never)}
    >
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text variant="titleMedium" style={styles.title}>
            {item.title}
          </Text>
          <Chip
            style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
            textStyle={styles.chipText}
          >
            {item.status}
          </Chip>
        </View>
        
        {item.description && (
          <Text variant="bodyMedium" style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        <View style={styles.cardFooter}>
          {item.endDate && (
            <Text variant="bodySmall" style={styles.date}>
              Target: {format(new Date(item.endDate), 'MMM dd, yyyy')}
            </Text>
          )}
          {item.area && (
            <Chip style={styles.areaChip} textStyle={styles.chipText}>
              {item.area}
            </Chip>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search goals..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={handleSearch}
          style={styles.searchbar}
        />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMenuVisible(true)}
              style={styles.filterButton}
            >
              Filter
            </Button>
          }
        >
          <Menu.Item
            onPress={() => {
              setStatusFilter(undefined);
              setMenuVisible(false);
              handleSearch();
            }}
            title="All"
          />
          <Menu.Item
            onPress={() => {
              setStatusFilter(GoalStatus.NOT_STARTED);
              setMenuVisible(false);
              handleSearch();
            }}
            title="Not Started"
          />
          <Menu.Item
            onPress={() => {
              setStatusFilter(GoalStatus.IN_PROGRESS);
              setMenuVisible(false);
              handleSearch();
            }}
            title="In Progress"
          />
          <Menu.Item
            onPress={() => {
              setStatusFilter(GoalStatus.COMPLETED);
              setMenuVisible(false);
              handleSearch();
            }}
            title="Completed"
          />
        </Menu>
      </View>

      <FlatList
        data={goals}
        renderItem={renderGoal}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text variant="bodyLarge" style={styles.emptyText}>
                No goals found
              </Text>
            </View>
          ) : null
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('GoalDetail' as never, { goalId: null } as never)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  searchbar: {
    flex: 1,
  },
  filterButton: {
    justifyContent: 'center',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontWeight: 'bold',
  },
  statusChip: {
    marginLeft: 8,
  },
  chipText: {
    color: '#fff',
    fontSize: 10,
  },
  description: {
    marginBottom: 8,
    color: '#757575',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    color: '#757575',
  },
  areaChip: {
    marginLeft: 8,
    backgroundColor: '#6200ee',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#757575',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});

