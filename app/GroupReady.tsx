import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GroupReadyApp = () => {
  const [currentView, setCurrentView] = useState('home');
  const [groupName, setGroupName] = useState('Saturday Night Out');
  const [targetTime, setTargetTime] = useState('8:00 PM');
  
  const [people, setPeople] = useState([
    { id: 1, name: 'Emma', readyTime: 25, isReady: false, avatar: '👩‍🦳', status: 'shower' },
    { id: 2, name: 'Jake', readyTime: 15, isReady: false, avatar: '👨‍🦱', status: 'getting dressed' },
    { id: 3, name: 'Mia', readyTime: 30, isReady: false, avatar: '👩‍🦰', status: 'makeup' },
    { id: 4, name: 'Alex', readyTime: 20, isReady: true, avatar: '👨‍🦲', status: 'ready!' },
    { id: 5, name: 'Sam', readyTime: 35, isReady: false, avatar: '👩', status: 'hair' },
    { id: 6, name: 'Chris', readyTime: 12, isReady: true, avatar: '👨', status: 'ready!' }
  ]);
  
  const [groupTasks, setGroupTasks] = useState([
    { id: 1, task: 'Book Uber XL', completed: false, assignedTo: 'Jake', urgent: true },
    { id: 2, task: 'Get cash for cover', completed: true, assignedTo: 'Emma', urgent: false },
    { id: 3, task: 'Check weather', completed: false, assignedTo: 'Mia', urgent: false },
    { id: 4, task: 'Charge portable battery', completed: false, assignedTo: 'Sam', urgent: false }
  ]);
  
  const [items, setItems] = useState([
    { id: 1, item: 'House keys', responsible: 'Alex', packed: true, category: 'essentials' },
    { id: 2, item: 'Phone chargers', responsible: 'Emma', packed: false, category: 'tech' },
    { id: 3, item: 'Gum/mints', responsible: 'Jake', packed: true, category: 'personal' },
    { id: 4, item: 'Hand sanitizer', responsible: 'Mia', packed: false, category: 'essentials' },
    { id: 5, item: 'Backup cash', responsible: 'Sam', packed: false, category: 'essentials' },
    { id: 6, item: 'Tissues', responsible: 'Chris', packed: true, category: 'personal' }
  ]);

  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonTime, setNewPersonTime] = useState('');
  
  const readyCount = people.filter(p => p.isReady).length;
  const totalPeople = people.length;
  const completedTasks = groupTasks.filter(t => t.completed).length;
  const packedItems = items.filter(i => i.packed).length;
  const urgentTasks = groupTasks.filter(t => !t.completed && t.urgent).length;
  
  const longestTime = Math.max(...people.filter(p => !p.isReady).map(p => p.readyTime), 0);
  const allReady = people.every(p => p.isReady);
  const allTasksDone = groupTasks.every(t => t.completed);
  const allItemsPacked = items.every(i => i.packed);

  const togglePersonReady = (id) => {
    setPeople(people.map(person => 
      person.id === id ? { 
        ...person, 
        isReady: !person.isReady,
        status: !person.isReady ? 'ready!' : 'getting ready'
      } : person
    ));
  };

  const addPerson = () => {
    if (newPersonName.trim() && newPersonTime) {
      const avatars = ['👩‍🦳', '👨‍🦱', '👩‍🦰', '👨‍🦲', '👩', '👨', '👩‍🦱', '👨‍🦳'];
      setPeople([...people, {
        id: Date.now(),
        name: newPersonName.trim(),
        readyTime: parseInt(newPersonTime),
        isReady: false,
        avatar: avatars[people.length % avatars.length],
        status: 'getting ready'
      }]);
      setNewPersonName('');
      setNewPersonTime('');
    } else {
      Alert.alert('Error', 'Please enter both name and time needed');
    }
  };

  const toggleTask = (id) => {
    setGroupTasks(groupTasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const toggleItem = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, packed: !item.packed } : item
    ));
  };

  // Home View Component
  const HomeView = () => (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.groupName}>{groupName}</Text>
        <Text style={styles.targetTime}>Target: {targetTime}</Text>
        {urgentTasks > 0 && (
          <View style={styles.urgentAlert}>
            <Ionicons name="notifications" size={16} color="#DC2626" />
            <Text style={styles.urgentText}>
              {urgentTasks} urgent task{urgentTasks > 1 ? 's' : ''} remaining
            </Text>
          </View>
        )}
      </View>

      {/* Status Cards */}
      <View style={styles.statusGrid}>
        <View style={styles.statusCard}>
          <Ionicons name="people" size={24} color="#2563EB" />
          <Text style={styles.statusNumber}>{readyCount}/{totalPeople}</Text>
          <Text style={styles.statusLabel}>Ready</Text>
        </View>
        <View style={styles.statusCard}>
          <Ionicons name="timer" size={24} color="#EA580C" />
          <Text style={styles.statusNumber}>{allReady ? '0' : longestTime}</Text>
          <Text style={styles.statusLabel}>Min left</Text>
        </View>
      </View>

      {/* People Grid */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Who's Ready?</Text>
        <View style={styles.peopleGrid}>
          {people.map(person => (
            <View 
              key={person.id} 
              style={[
                styles.personCard,
                person.isReady ? styles.personCardReady : styles.personCardNotReady
              ]}
            >
              <View style={styles.personHeader}>
                <Text style={styles.avatar}>{person.avatar}</Text>
                <Text style={styles.personName}>{person.name}</Text>
                {person.isReady && <Ionicons name="checkmark" size={16} color="#16A34A" />}
              </View>
              <Text style={styles.personStatus}>{person.status}</Text>
              {!person.isReady && (
                <Text style={styles.personTime}>~{person.readyTime} min</Text>
              )}
              <TouchableOpacity
                style={[
                  styles.readyButton,
                  person.isReady ? styles.readyButtonActive : styles.readyButtonInactive
                ]}
                onPress={() => togglePersonReady(person.id)}
              >
                <Text style={styles.readyButtonText}>
                  {person.isReady ? 'Ready!' : 'Mark Ready'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statusGrid}>
        <View style={styles.statusCard}>
          <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
          <Text style={styles.statusNumber}>{completedTasks}/{groupTasks.length}</Text>
          <Text style={styles.statusLabel}>Tasks</Text>
        </View>
        <View style={styles.statusCard}>
          <Ionicons name="bag" size={20} color="#7C3AED" />
          <Text style={styles.statusNumber}>{packedItems}/{items.length}</Text>
          <Text style={styles.statusLabel}>Items</Text>
        </View>
      </View>

      {/* Success State */}
      {allReady && allTasksDone && allItemsPacked && (
        <View style={styles.successCard}>
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={styles.successTitle}>Everyone's Ready!</Text>
          <Text style={styles.successSubtitle}>Time to head out!</Text>
        </View>
      )}
    </ScrollView>
  );

  // People View Component
  const PeopleView = () => (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.viewHeader}>
        <Text style={styles.viewTitle}>People</Text>
        <Text style={styles.viewSubtitle}>{readyCount}/{totalPeople} ready</Text>
      </View>
      
      {people.map(person => (
        <View key={person.id} style={styles.card}>
          <View style={styles.personDetailHeader}>
            <View style={styles.personDetailInfo}>
              <Text style={styles.avatarLarge}>{person.avatar}</Text>
              <View>
                <Text style={styles.personDetailName}>{person.name}</Text>
                <Text style={styles.personDetailStatus}>{person.status}</Text>
              </View>
            </View>
            <View style={styles.personDetailTime}>
              {person.isReady ? (
                <Text style={styles.readyText}>Ready!</Text>
              ) : (
                <Text style={styles.timeText}>~{person.readyTime}m</Text>
              )}
            </View>
          </View>
          
          <TouchableOpacity
            style={[
              styles.toggleButton,
              person.isReady ? styles.toggleButtonReady : styles.toggleButtonNotReady
            ]}
            onPress={() => togglePersonReady(person.id)}
          >
            <Text style={styles.toggleButtonText}>
              {person.isReady ? 'Mark Not Ready' : 'Mark Ready'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Add Person</Text>
        <View style={styles.addPersonForm}>
          <TextInput
            style={styles.textInput}
            placeholder="Name"
            value={newPersonName}
            onChangeText={setNewPersonName}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Minutes needed"
            value={newPersonTime}
            onChangeText={setNewPersonTime}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.addButton} onPress={addPerson}>
            <Text style={styles.addButtonText}>Add Person</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  // Tasks View Component
  const TasksView = () => (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.viewHeader}>
        <Text style={styles.viewTitle}>Group Tasks</Text>
        <Text style={styles.viewSubtitle}>{completedTasks}/{groupTasks.length} done</Text>
      </View>
      
      {groupTasks.map(task => (
        <View 
          key={task.id} 
          style={[
            styles.card,
            task.urgent && !task.completed ? styles.urgentTask : null
          ]}
        >
          <TouchableOpacity 
            style={styles.taskItem}
            onPress={() => toggleTask(task.id)}
          >
            <Ionicons 
              name={task.completed ? "checkmark-circle" : "ellipse-outline"} 
              size={24} 
              color={task.completed ? "#16A34A" : "#6B7280"} 
            />
            <View style={styles.taskContent}>
              <Text style={[
                styles.taskText,
                task.completed ? styles.taskTextCompleted : null
              ]}>
                {task.task}
                {task.urgent && !task.completed && ' 🚨'}
              </Text>
              <Text style={styles.taskAssignee}>{task.assignedTo}</Text>
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );

  // Items View Component
  const ItemsView = () => (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.viewHeader}>
        <Text style={styles.viewTitle}>Packing List</Text>
        <Text style={styles.viewSubtitle}>{packedItems}/{items.length} packed</Text>
      </View>
      
      {items.map(item => (
        <View key={item.id} style={styles.card}>
          <TouchableOpacity 
            style={styles.taskItem}
            onPress={() => toggleItem(item.id)}
          >
            <Ionicons 
              name={item.packed ? "checkmark-circle" : "ellipse-outline"} 
              size={24} 
              color={item.packed ? "#7C3AED" : "#6B7280"} 
            />
            <View style={styles.taskContent}>
              <Text style={[
                styles.taskText,
                item.packed ? styles.taskTextCompleted : null
              ]}>
                {item.item}
              </Text>
              <Text style={styles.taskAssignee}>{item.responsible}</Text>
            </View>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Content */}
      <View style={styles.content}>
        {currentView === 'home' && <HomeView />}
        {currentView === 'people' && <PeopleView />}
        {currentView === 'tasks' && <TasksView />}
        {currentView === 'items' && <ItemsView />}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[
          { id: 'home', icon: 'home', label: 'Home' },
          { id: 'people', icon: 'people', label: 'People' },
          { id: 'tasks', icon: 'checkmark-circle', label: 'Tasks' },
          { id: 'items', icon: 'bag', label: 'Items' }
        ].map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.navTab,
              currentView === tab.id ? styles.navTabActive : null
            ]}
            onPress={() => setCurrentView(tab.id)}
          >
            <Ionicons 
              name={tab.icon} 
              size={20} 
              color={currentView === tab.id ? '#2563EB' : '#6B7280'} 
            />
            <Text style={[
              styles.navLabel,
              currentView === tab.id ? styles.navLabelActive : null
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  groupName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  targetTime: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  urgentAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  urgentText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '500',
  },
  statusGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statusCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  peopleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  personCard: {
    width: '48%',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  personCardReady: {
    borderColor: '#16A34A',
    backgroundColor: '#F0FDF4',
  },
  personCardNotReady: {
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  personHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  avatar: {
    fontSize: 18,
  },
  personName: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  personStatus: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  personTime: {
    fontSize: 12,
    color: '#EA580C',
    fontWeight: '500',
    marginBottom: 8,
  },
  readyButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  readyButtonActive: {
    backgroundColor: '#16A34A',
  },
  readyButtonInactive: {
    backgroundColor: '#EA580C',
  },
  readyButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  successCard: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  successEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  successSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  viewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  viewSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  personDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  personDetailInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarLarge: {
    fontSize: 24,
  },
  personDetailName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  personDetailStatus: {
    fontSize: 14,
    color: '#6B7280',
  },
  personDetailTime: {
    alignItems: 'flex-end',
  },
  readyText: {
    color: '#16A34A',
    fontWeight: '500',
  },
  timeText: {
    color: '#EA580C',
    fontWeight: '500',
  },
  toggleButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButtonReady: {
    backgroundColor: '#16A34A',
  },
  toggleButtonNotReady: {
    backgroundColor: '#EA580C',
  },
  toggleButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  addPersonForm: {
    gap: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
  urgentTask: {
    borderColor: '#FECACA',
    borderWidth: 2,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  taskAssignee: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  categoryBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#6B7280',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 12,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  navTabActive: {
    backgroundColor: '#EFF6FF',
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  navLabelActive: {
    color: '#2563EB',
  },
});

export default GroupReadyApp;