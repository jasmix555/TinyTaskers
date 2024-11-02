interface TaskCompletionProps {
  points: number;
  onClose: () => void;
}

const TaskCompletion = ({points, onClose}: TaskCompletionProps) => {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="rounded bg-white p-6 shadow-lg">
        <h3 className="text-xl font-semibold">Task Completed!</h3>
        <p>You earned {points} points!</p>
        <button className="rounded bg-blue-500 p-2 text-white" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default TaskCompletion;
