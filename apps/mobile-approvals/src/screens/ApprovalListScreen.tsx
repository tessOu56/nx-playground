import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { AccessRequestApproval } from '../data/mockApprovals';

interface Props {
  pending: AccessRequestApproval[];
  onSelect: (decisionId: string) => void;
}

export function ApprovalListScreen({ pending, onSelect }: Props) {
  return (
    <View style={styles.container} testID="approval-list-screen">
      <Text style={styles.title}>Pending approvals ({pending.length})</Text>
      <FlatList
        data={pending}
        keyExtractor={(item) => item.decision_id}
        renderItem={({ item }) => (
          <Pressable
            testID={`approval-row-${item.decision_id}`}
            style={styles.row}
            onPress={() => onSelect(item.decision_id)}
          >
            <Text style={styles.requester}>{item.requester}</Text>
            <Text style={styles.resource}>{item.resource}</Text>
            <Text style={styles.reason}>{item.reason}</Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No pending approvals.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  row: { padding: 12, borderRadius: 8, backgroundColor: '#f2f2f7', marginBottom: 8 },
  requester: { fontWeight: '600' },
  resource: { color: '#555', marginTop: 2 },
  reason: { color: '#888', marginTop: 2, fontSize: 12 },
  empty: { color: '#888', textAlign: 'center', marginTop: 24 },
});
