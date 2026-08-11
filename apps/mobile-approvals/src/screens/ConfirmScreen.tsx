import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AccessRequestApproval } from '../data/mockApprovals';
import { Decision } from '../state/useApprovals';

interface Props {
  approval: AccessRequestApproval;
  onDecide: (decisionId: string, decision: Decision) => void;
  onCancel: () => void;
}

export function ConfirmScreen({ approval, onDecide, onCancel }: Props) {
  return (
    <View style={styles.container} testID="confirm-screen">
      <Text style={styles.title}>Confirm decision</Text>
      <Text style={styles.label}>Requester</Text>
      <Text style={styles.value}>{approval.requester}</Text>
      <Text style={styles.label}>Resource</Text>
      <Text style={styles.value}>{approval.resource}</Text>
      <Text style={styles.label}>Reason</Text>
      <Text style={styles.value}>{approval.reason}</Text>

      <View style={styles.actions}>
        <Pressable
          testID="approve-button"
          style={[styles.button, styles.approve]}
          onPress={() => onDecide(approval.decision_id, 'approved')}
        >
          <Text style={styles.buttonText}>Approve</Text>
        </Pressable>
        <Pressable
          testID="deny-button"
          style={[styles.button, styles.deny]}
          onPress={() => onDecide(approval.decision_id, 'denied')}
        >
          <Text style={styles.buttonText}>Deny</Text>
        </Pressable>
      </View>
      <Pressable testID="cancel-button" onPress={onCancel}>
        <Text style={styles.cancel}>Back to list</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 16 },
  label: { color: '#888', fontSize: 12, marginTop: 8 },
  value: { fontSize: 16 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  button: { flex: 1, padding: 14, borderRadius: 8, alignItems: 'center' },
  approve: { backgroundColor: '#2e7d32' },
  deny: { backgroundColor: '#c62828' },
  buttonText: { color: '#fff', fontWeight: '600' },
  cancel: { color: '#888', marginTop: 16, textAlign: 'center' },
});
