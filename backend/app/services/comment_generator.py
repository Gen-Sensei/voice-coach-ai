def generate_comments(metrics: dict, scores: dict) -> dict:
    strengths = []
    improvements = []
    next_training = []

    # Volume stability
    if scores["volume_stability"] >= 80:
        strengths.append("声量が比較的安定しています")
    elif scores["volume_stability"] < 70:
        improvements.append("文末まで声を届けるよう意識しましょう")
        next_training.append("文末まで声量を保つ練習")

    # Intonation
    pitch_range = metrics["pitch"].get("range_hz")
    if scores["intonation"] >= 85:
        strengths.append("声の抑揚が自然についています")
    elif pitch_range is not None and pitch_range < 50:
        improvements.append("重要な単語の前後で声の高さを少し変えると、聞き手に伝わりやすくなります")
        next_training.append("重要語を少し強調して読む練習")
    elif pitch_range is not None and pitch_range > 250:
        improvements.append("声の高さの変化が大きすぎる可能性があります。落ち着いたトーンを意識してみましょう")
        next_training.append("一定のトーンで安定して話す練習")

    # Pause
    if scores["pause"] >= 80:
        strengths.append("適度な間が取れています")
    elif scores["pause"] < 65:
        avg_silence = metrics["silence"].get("avg_sec", 0)
        max_silence = metrics["silence"].get("max_sec", 0)
        if avg_silence < 0.25:
            improvements.append("文と文の間をもう少し取ると聞き取りやすくなります")
            next_training.append("句点ごとに0.5秒止まる練習")
        elif max_silence > 3.0:
            improvements.append("長すぎる沈黙があります。適度な間を意識しましょう")
            next_training.append("一定のリズムで話す練習")

    # Recording quality
    if scores["recording_quality"] >= 80:
        strengths.append("録音品質は良好です")

    # Summary
    overall = scores["overall"]
    if overall >= 85:
        summary = "素晴らしい発声です！全体的に聞き取りやすく、バランスが取れています。"
    elif overall >= 70:
        summary = "全体的に落ち着いた聞き取りやすい声です。いくつかのポイントを意識するとさらに良くなります。"
    elif overall >= 55:
        summary = "基本的な発声はできています。いくつかの点を改善することで、より伝わりやすくなります。"
    else:
        summary = "発声の基礎から練習することをおすすめします。焦らず一つずつ改善していきましょう。"

    if not strengths:
        strengths.append("練習を続けることで改善が期待できます")
    if not improvements:
        improvements.append("この調子で練習を続けてください")
    if not next_training:
        next_training.append("録音を繰り返して変化を確認しましょう")

    return {
        "summary": summary,
        "strengths": strengths,
        "improvements": improvements,
        "next_training": next_training,
    }
