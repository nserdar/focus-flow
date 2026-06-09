import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Card,
  SegmentedButtons,
  Portal,
  Dialog,
  ActivityIndicator,
} from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { goalService } from '../../services/goalService';
import { Goal, GoalRequest, GoalStatus } from '../../types';
import { format } from 'date-fns';

export default function GoalDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const goalId = (route.params as any)?.goalId;

  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<GoalStatus>(GoalStatus.NOT_STARTED);
  const [priority, setPriority] = useState('2');
  const [area, setArea] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (goalId) {
      loadGoal();
    } else {
      setLoading(false);
    }
  }, [goalId]);

  const loadGoal = async () => {
    try {
      setLoading(true);
      const data = await goalService.getById(goalId);
      setGoal(data);
      setTitle(data.title);
      setDescription(data.description || '');
      setStatus(data.status);
      setPriority(data.priority.toString());
      setArea(data.area || '');
      setStartDate(data.startDate || '');
      setEndDate(data.endDate || '');
    } catch (error) {
      Alert.alert('Error', 'Failed to load goal');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    try {
      setSaving(true);
      const goalData: GoalRequest = {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority: parseInt(priority),
        area: area.trim() || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      };

      if (goalId) {
        await goalService.update(goalId, goalData);
        Alert.alert('Success', 'Goal updated successfully');
      } else {
        await goalService.create(goalData);
        Alert.alert('Success', 'Goal created successfully');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save goal');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSaving(true);
      await goalService.delete(goalId);
      Alert.alert('Success', 'Goal deleted successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete goal');
    } finally {
      setSaving(false);
      setDeleteDialogVisible(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            label="Title *"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
          />

          <View style={styles.row}>
            <Text variant="bodyLarge" style={styles.label}>
              Status:
            </Text>
            <SegmentedButtons
              value={status}
              onValueChange={(value) => setStatus(value as GoalStatus)}
              buttons={[
                { value: GoalStatus.NOT_STARTED, label: 'Not Started' },
                { value: GoalStatus.IN_PROGRESS, label: 'In Progress' },
                { value: GoalStatus.COMPLETED, label: 'Completed' },
              ]}
              style={styles.segmentedButtons}
            />
          </View>

          <View style={styles.row}>
            <Text variant="bodyLarge" style={styles.label}>
              Priority:
            </Text>
            <SegmentedButtons
              value={priority}
              onValueChange={setPriority}
              buttons={[
                { value: '1', label: 'Low' },
                { value: '2', label: 'Normal' },
                { value: '3', label: 'High' },
                { value: '4', label: 'Critical' },
              ]}
              style={styles.segmentedButtons}
            />
          </View>

          <TextInput
            label="Area (e.g., Work, Personal)"
            value={area}
            onChangeText={setArea}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Start Date (YYYY-MM-DD)"
            value={startDate}
            onChangeText={setStartDate}
            mode="outlined"
            placeholder="2024-01-01"
            style={styles.input}
          />

          <TextInput
            label="End Date (YYYY-MM-DD)"
            value={endDate}
            onChangeText={setEndDate}
            mode="outlined"
            placeholder="2024-12-31"
            style={styles.input}
          />

          {goal && (
            <View style={styles.infoContainer}>
              <Text variant="bodySmall" style={styles.infoText}>
                Created: {format(new Date(goal.createdAt), 'MMM dd, yyyy HH:mm')}
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSave}
          loading={saving}
          disabled={saving}
          style={styles.button}
        >
          {goalId ? 'Update' : 'Create'}
        </Button>

        {goalId && (
          <Button
            mode="outlined"
            onPress={() => setDeleteDialogVisible(true)}
            disabled={saving}
            buttonColor="#f44336"
            textColor="#fff"
            style={styles.button}
          >
            Delete
          </Button>
        )}
      </View>

      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Delete Goal</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this goal? This action cannot be undone.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleDelete} textColor="#f44336">
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
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
  card: {
    margin: 16,
    elevation: 2,
  },
  input: {
    marginBottom: 16,
  },
  row: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  segmentedButtons: {
    marginTop: 8,
  },
  infoContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  infoText: {
    color: '#757575',
    marginBottom: 4,
  },
  buttonContainer: {
    padding: 16,
    gap: 12,
  },
  button: {
    paddingVertical: 4,
  },
});

