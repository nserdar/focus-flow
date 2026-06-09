import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Card,
  Chip,
  SegmentedButtons,
  Portal,
  Dialog,
  ActivityIndicator,
} from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { taskService } from '../../services/taskService';
import { Task, TaskRequest, TaskStatus } from '../../types';
import { format } from 'date-fns';

export default function TaskDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const taskId = (route.params as any)?.taskId;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [priority, setPriority] = useState('2');
  const [area, setArea] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (taskId) {
      loadTask();
    } else {
      setLoading(false);
    }
  }, [taskId]);

  const loadTask = async () => {
    try {
      setLoading(true);
      const data = await taskService.getById(taskId);
      setTask(data);
      setTitle(data.title);
      setDescription(data.description || '');
      setStatus(data.status);
      setPriority(data.priority.toString());
      setArea(data.area || '');
      setDueDate(data.dueDate || '');
    } catch (error) {
      Alert.alert('Error', 'Failed to load task');
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
      const taskData: TaskRequest = {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority: parseInt(priority),
        area: area.trim() || undefined,
        dueDate: dueDate || undefined,
      };

      if (taskId) {
        await taskService.update(taskId, taskData);
        Alert.alert('Success', 'Task updated successfully');
      } else {
        await taskService.create(taskData);
        Alert.alert('Success', 'Task created successfully');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save task');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSaving(true);
      await taskService.delete(taskId);
      Alert.alert('Success', 'Task deleted successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete task');
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
              onValueChange={(value) => setStatus(value as TaskStatus)}
              buttons={[
                { value: TaskStatus.TODO, label: 'Todo' },
                { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
                { value: TaskStatus.COMPLETED, label: 'Done' },
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
            label="Due Date (YYYY-MM-DD)"
            value={dueDate}
            onChangeText={setDueDate}
            mode="outlined"
            placeholder="2024-12-31"
            style={styles.input}
          />

          {task && (
            <View style={styles.infoContainer}>
              <Text variant="bodySmall" style={styles.infoText}>
                Created: {format(new Date(task.createdAt), 'MMM dd, yyyy HH:mm')}
              </Text>
              {task.totalFocusSeconds && (
                <Text variant="bodySmall" style={styles.infoText}>
                  Total Focus Time: {Math.floor(task.totalFocusSeconds / 60)} minutes
                </Text>
              )}
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
          {taskId ? 'Update' : 'Create'}
        </Button>

        {taskId && (
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
          <Dialog.Title>Delete Task</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this task? This action cannot be undone.</Text>
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

