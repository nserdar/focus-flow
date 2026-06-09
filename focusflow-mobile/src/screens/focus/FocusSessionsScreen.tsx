import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Card, Text, Chip, Searchbar, ActivityIndicator } from 'react-native-paper';
import { focusSessionService } from '../../services/focusSessionService';
import { FocusSession } from '../../types';
import { format } from 'date-fns';

export default function FocusSessionsScreen() {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadSessions = useCallback(async (pageNum = 0, reset = false) => {
    try {
      setLoading(true);
      const response = await focusSessionService.getAll(pageNum, 20, 'startedAt', 'DESC');
      
      if (reset) {
        setSessions(response.content);
      } else {
        setSessions((prev) => [...prev, ...response.content]);
      }
      
      setHasMore(!response.last);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadSessions(0, true);
  }, [loadSessions]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadSessions(0, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadSessions(page + 1, false);
    }
  };

  const getStatusColor = (session: FocusSession) => {
    if (session.canceled) return '#f44336';
    if (session.completed) return '#4caf50';
    if (session.active) return '#2196f3';
    return '#757575';
  };

  const getStatusText = (session: FocusSession) => {
    if (session.canceled) return 'Canceled';
    if (session.completed) return 'Completed';
    if (session.active) return 'Active';
    return 'Unknown';
  };

  const renderSession = ({ item }: { item: FocusSession }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text variant="titleMedium" style={styles.title}>
            Task #{item.taskId}
          </Text>
          <Chip
            style={[styles.statusChip, { backgroundColor: getStatusColor(item) }]}
            textStyle={styles.chipText}
          >
            {getStatusText(item)}
          </Chip>
        </View>

        <View style={styles.infoRow}>
          <Text variant="bodySmall" style={styles.infoText}>
            Started: {format(new Date(item.startedAt), 'MMM dd, yyyy HH:mm')}
          </Text>
        </View>

        {item.finishedAt && (
          <View style={styles.infoRow}>
            <Text variant="bodySmall" style={styles.infoText}>
              Finished: {format(new Date(item.finishedAt), 'MMM dd, yyyy HH:mm')}
            </Text>
          </View>
        )}

        {item.durationMinutes && (
          <View style={styles.infoRow}>
            <Text variant="bodyMedium" style={styles.duration}>
              Duration: {item.durationMinutes} minutes
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  if (loading && sessions.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search focus sessions..."
        style={styles.searchbar}
        onChangeText={() => {}}
      />

      <FlatList
        data={sessions}
        renderItem={renderSession}
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
                No focus sessions found
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchbar: {
    margin: 16,
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
  infoRow: {
    marginTop: 4,
  },
  infoText: {
    color: '#757575',
  },
  duration: {
    fontWeight: 'bold',
    color: '#6200ee',
    marginTop: 8,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#757575',
  },
});

