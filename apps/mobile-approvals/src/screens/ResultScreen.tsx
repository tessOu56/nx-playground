import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AccessRequestApproval } from '../data/mockApprovals';

interface Props {
  approval: AccessRequestApproval;
  onDone: () => void;
}

export function ResultScreen({ approval, onDone }: Props) {
  const approved = approval.status === 'approved';
  return (
    <View style={styles.container} testID="result-screen">
      <Text style={[styles.status, approved ? styles.approved : styles.denied]}>
        {approved ? 'Approved' : 'Denied'}
      </Text>
      <Text style={styles.decisionId}>decision_id: {approval.decision_id}</Text>
      <Text style={styles.audit} testID="audit-logged">
        auditLogged: {String(approval.auditLogged)}
      </Text>
      <Pressable testID="done-button" style={styles.doneButton} onPress={onDone}>
        <Text style={styles.doneText}>Back to list</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, alignItems: 'center', justifyContent: 'center' },
  status: { fontSize: 28, fontWeight: '700', marginBottom: 12 },
  approved: { color: '#2e7d32' },
  denied: { color: '#c62828' },
  decisionId: { color: '#555', marginBottom: 4 },
  audit: { color: '#888', marginBottom: 24 },
  doneButton: { padding: 14, borderRadius: 8, backgroundColor: '#eee' },
  doneText: { fontWeight: '600' },
});
