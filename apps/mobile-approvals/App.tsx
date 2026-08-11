import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ApprovalListScreen } from './src/screens/ApprovalListScreen';
import { ConfirmScreen } from './src/screens/ConfirmScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { useApprovals } from './src/state/useApprovals';

type Step = 'list' | 'confirm' | 'result';

export default function App() {
  const { pending, selected, select, clearSelection, decide } = useApprovals();
  const [step, setStep] = useState<Step>('list');

  const handleSelect = (decisionId: string) => {
    select(decisionId);
    setStep('confirm');
  };

  const handleDecide = (decisionId: string, decision: 'approved' | 'denied') => {
    decide(decisionId, decision);
    setStep('result');
  };

  const handleDone = () => {
    clearSelection();
    setStep('list');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      {step === 'list' && <ApprovalListScreen pending={pending} onSelect={handleSelect} />}
      {step === 'confirm' && selected && (
        <ConfirmScreen approval={selected} onDecide={handleDecide} onCancel={handleDone} />
      )}
      {step === 'result' && selected && <ResultScreen approval={selected} onDone={handleDone} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});
