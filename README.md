# SCENE: A Scenario Completion Benchmark for Measuring Social Bias in Large Language Models

**[Project page](https://dsail-skku.github.io/SCENE-EMNLP-2026/)** · [Website maintenance guide](WEBSITE.md) · [Code and data branch](https://github.com/DSAIL-SKKU/SCENE-EMNLP-2026/tree/main)

This is the `project_page` branch, which serves the static research website through GitHub Pages.

Official repository for **SCENE: A Scenario Completion Benchmark for Measuring Social Bias in Large Language Models**, accepted to **Findings of EMNLP 2026**.

> **Release status:** The detailed code, benchmark data, and evaluation scripts will be uploaded in a future update.

## Overview

Most existing social-bias benchmarks evaluate large language models (LLMs) using multiple-choice questions (MCQs). Although MCQs are easy to quantify, they may not fully capture how stereotypes emerge when models complete narratives or assign roles to characters.

SCENE evaluates social bias through **scenario completion** while retaining structured, directly quantifiable outputs. It contains two complementary tasks:

- **Character Specification:** The model assigns social attributes to anonymous characters based on their roles in a scenario.
- **Plot Continuation:** The model selects the most plausible continuation of a scenario from biased, neutral, and counter-stereotypical alternatives.

Because both tasks produce structured outputs, SCENE measures model bias directly without relying on an auxiliary LLM evaluator.



## Benchmark Construction

<img width="3584" height="1765" alt="overall_page-0001" src="https://github.com/user-attachments/assets/83404244-04e9-4a2d-a488-a0c5697d1c38" />

SCENE is constructed from two complementary template sources:

1. **KoBBQ:** 269 templates covering established social-bias categories.
2. **University-wide competition:** 107 curated templates capturing contemporary contexts and underrepresented stereotypes. The competition involved 23 teams and also uncovered three additional bias categories: occupation, personality, and technology.

The resulting 376 seed templates are reformulated into the two SCENE tasks and expanded through a three-stage augmentation pipeline:

1. **Context Replacement** varies contextual details while preserving the underlying event and stereotype.
2. **Entity Refinement** replaces broad social-group labels with diverse, fine-grained expressions.
3. **Choice Paraphrasing** introduces surface-level linguistic variation while preserving meaning.

Entity-order swapping is additionally applied to control for positional bias. After quality filtering, the final Korean benchmark contains **75,155 instances**:

| Task | Number of instances |
|---|---:|
| Character Specification | 37,562 |
| Plot Continuation | 37,593 |
| **Total** | **75,155** |

## Evaluation

We evaluate eight closed- and open-source LLMs: GPT-5.1, GPT-5.2, Qwen3-8B, Qwen3-32B, EXAONE-7.8B, EXAONE-32B, Llama-3.1-8B, and Llama-3.1-70B.

Model behavior is measured using:

- **Biased Rate (BR):** proportion of stereotype-consistent outputs.
- **Neutral Rate (NR):** proportion of neutral outputs.
- **Counter-stereotypical Rate (CR):** proportion of stereotype-reversing outputs.

## Key Findings

### 1. Bias measurements are highly sensitive to task format

Even when models are evaluated on identical underlying scenarios, different task formulations produce substantially different estimates of social bias. On KoBBQ-derived templates, Character Specification and Plot Continuation generally elicit higher biased rates than conventional MCQs.

| Model | MCQ BR (%) | Plot Continuation BR (%) | Character Specification BR (%) |
|---|---:|---:|---:|
| GPT-5.1 | 14.46 | 35.70 | 66.75 |
| Qwen3-8B | 23.66 | 47.41 | 61.18 |
| EXAONE-7.8B | 27.76 | 34.12 | 47.33 |
| Llama-3.1-8B | 21.11 | 47.24 | 30.25 |

Template-level correlations across task formats are consistently low to moderate, indicating that each format captures distinct patterns of bias rather than producing interchangeable measurements.

### 2. Output constraints change how bias manifests

Reformulating Character Specification from direct generation into a selection-based task substantially changes biased, neutral, and counter-stereotypical response patterns. This shows that measured bias depends not only on scenario content but also on how the model is required to respond.

### 3. Entity diversity more strongly elicits latent stereotypes

Among the augmentation stages, **Entity Refinement** has the largest effect on Character Specification. Introducing diverse expressions for social groups generally increases biased responses and reduces neutral responses, highlighting the importance of lexical diversity in bias evaluation.

### 4. Contemporary templates reveal underrepresented biases

Competition-derived templates generally produce higher biased rates and lower neutral rates than KoBBQ-derived templates in Character Specification. This finding emphasizes the need to continuously update bias benchmarks with contemporary contexts and underrepresented stereotypes.

<!-- IMAGE PLACEHOLDER 3
Recommended result image:
- Use Figure 3 to emphasize that task formats capture distinct bias patterns; or
- Use Figure 4 to emphasize differences between KoBBQ and competition-derived templates.

Suggested file path: assets/scene_key_results.png

After adding the image file, replace this comment with:
<p align="center">
  <img src="assets/scene_key_results.png" width="850" alt="Key experimental findings from SCENE">
</p>
<p align="center"><em>Key experimental findings from SCENE.</em></p>
-->

## Repository Status

The detailed implementation, SCENE dataset, evaluation scripts, prompts, and usage instructions will be uploaded in a future update.


## Citation

The BibTeX entry will be added after publication.
