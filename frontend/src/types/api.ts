export interface ObservedRange {
  min: number;
  max: number;
}

export interface PromptAnalysis {
  word_count: number;
  char_count: number;
  has_role_or_context: boolean;
  has_task_instruction: boolean;
  has_audience: boolean;
  has_format_specification: boolean;
  has_constraints: boolean;
  has_examples_request: boolean;
  structural_breadth: 'Minimal' | 'Basic' | 'Moderate' | 'Comprehensive';
}

export interface PredictRequest {
  prompt: string;
}

export interface PredictResponse {
  prompt: string;
  predicted_score: number;
  model: string;
  observed_dataset_range: ObservedRange;
  is_within_observed_range: boolean;
  disclaimer: string;
  suggestions: string[];
  analysis: PromptAnalysis;
  suggested_template?: string;
}

export interface CompareRequest {
  original_prompt: string;
  revised_prompt: string;
}

export interface CompareResponse {
  original_prompt: string;
  original_score: number;
  revised_prompt: string;
  revised_score: number;
  score_diff: number;
  model: string;
  observed_dataset_range: ObservedRange;
  disclaimer: string;
  original_suggestions: string[];
  revised_suggestions: string[];
  original_analysis: PromptAnalysis;
  revised_analysis: PromptAnalysis;
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  model_identifier: string;
  model_path: string;
  detail?: string;
}

export interface ModelArchitectureInfo {
  framework: string;
  keras_format: string;
  vocabulary_limit: number;
  sequence_length: number;
  embedding_dimension: number;
  bilstm_units: number;
  dropout_rate: number;
  dense_output: number;
  output_activation: string;
  optimizer: string;
  learning_rate: number;
  loss_function: string;
  batch_size: number;
  max_epochs: number;
  early_stopping_patience: number;
}

export interface DatasetInfo {
  name: string;
  source: string;
  excel_filename: string;
  worksheet: string;
  total_raw_records: number;
  unique_modeling_records: number;
  training_samples: number;
  validation_samples: number;
  testing_samples: number;
  input_feature: string;
  target_column: string;
  observed_score_min: number;
  observed_score_max: number;
  rubric_dimensions: string[];
}

export interface ModelInfoResponse {
  model_name: string;
  architecture_details: ModelArchitectureInfo;
  dataset_details: DatasetInfo;
  headline_metrics: {
    MAE: number;
    MSE: number;
    RMSE: number;
    R2: number;
  };
  architectural_flow: string[];
}

export interface ModelComparisonRecord {
  model: string;
  mae: number;
  mse: number;
  rmse: number;
  r2: number;
  rank_by_mae: number;
}

export interface MetricsResponse {
  records: ModelComparisonRecord[];
  best_model: string;
  mae_reduction_vs_baseline_pct: number;
  regression_notes: string;
}

export type PageId = 'home' | 'evaluator' | 'improve' | 'explained' | 'analytics' | 'about';
