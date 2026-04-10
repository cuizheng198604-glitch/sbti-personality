"""
SBTI × Big Five 混合卡牌抽卡模拟器
输出 UTF-8 编码，直接写入文件解决 Windows 终端乱码问题
"""

import random
import sys
import io
import json
from dataclasses import dataclass, asdict
from typing import List, Tuple, Dict

# ─────────────────────────────────────────────
# 强制 UTF-8 输出（解决 Windows 终端乱码）
# ─────────────────────────────────────────────
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')


# ─────────────────────────────────────────────
# 稀有度配置
# ─────────────────────────────────────────────
RARITY_CONFIG = {
    "Common":    {"prob": 0.50, "star": "★★☆☆☆", "attr_bonus": 0,   "skill_slots": 0},
    "Rare":      {"prob": 0.25, "star": "★★★☆☆", "attr_bonus": 30,  "skill_slots": 1},
    "Special":   {"prob": 0.15, "star": "★★★★☆", "attr_bonus": 60,  "skill_slots": 2},
    "Legendary": {"prob": 0.10, "star": "★★★★★", "attr_bonus": 100, "skill_slots": 3},
}

RARITY_BORDER = {
    "Common":    "─" * 40,
    "Rare":      "═" * 40,
    "Special":   "╔═" + "═" * 36 + "═╗",
    "Legendary": "╔★═" + "═" * 34 + "═★╗",
}

RARITY_COLOR_TAG = {
    "Common":    "\033[90m",
    "Rare":      "\033[94m",
    "Special":   "\033[35m",
    "Legendary": "\033[93m",
}


# ─────────────────────────────────────────────
# SBTI 四维
# ─────────────────────────────────────────────
SBTI_DIMENSIONS = {
    "Energy":    {"E": "外向活跃", "I": "内向沉稳"},
    "Awareness": {"S": "务实细节", "N": "直觉抽象"},
    "Decision":  {"T": "理性逻辑", "F": "情感共情"},
    "Execution": {"J": "计划执行", "P": "灵活探索"},
}

TYPE_META = {
    "ENTP": {"role": "发明家",     "keywords": ["齿轮", "星空", "漂浮元素"],  "element": "风"},
    "ENTJ": {"role": "指挥官",     "keywords": ["棋子", "剑", "精密机械"],    "element": "火"},
    "ENFP": {"role": "冒险家",     "keywords": ["羽毛", "画笔", "彩虹"],      "element": "光"},
    "ENFJ": {"role": "导师",       "keywords": ["光环", "羽翼", "暖光"],      "element": "光"},
    "ESFP": {"role": "表演者",     "keywords": ["聚光灯", "舞者", "花瓣"],    "element": "火"},
    "ESFJ": {"role": "执政官",     "keywords": ["徽章", "盾牌", "秩序光"],    "element": "土"},
    "ESTP": {"role": "企业家",     "keywords": ["金币", "地图", "骏马"],      "element": "火"},
    "ESTJ": {"role": "管理者",     "keywords": ["天平", "法典", "石柱"],      "element": "土"},
    "INTP": {"role": "建筑师",     "keywords": ["蓝图", "水晶", "理性光"],    "element": "水"},
    "INTJ": {"role": "策划者",     "keywords": ["建筑", "月亮", "冷色光效"],  "element": "水"},
    "INFP": {"role": "理想者",     "keywords": ["羽翼", "光芒", "梦幻粒子"],  "element": "风"},
    "INFJ": {"role": "预言家",     "keywords": ["月亮", "书卷", "星空长袍"],  "element": "水"},
    "ISFP": {"role": "艺术家",     "keywords": ["画架", "旅途", "异国元素"],  "element": "风"},
    "ISFJ": {"role": "守护者",     "keywords": ["花藤", "心形", "柔和的光"],  "element": "土"},
    "ISTP": {"role": "匠人",       "keywords": ["锤子", "工具箱", "熔炉"],    "element": "火"},
    "ISTJ": {"role": "审计官",     "keywords": ["天平", "账簿", "秩序感"],   "element": "土"},
}

# ─────────────────────────────────────────────
# 技能库
# ─────────────────────────────────────────────
BIGFIVE_SKILLS = {
    "Openness": {
        "high": ("无限可能", "暴击伤害+30%，但暴击率-5%"),
        "mid":  ("灵感迸发", "速度低于对方时，25%概率追击"),
    },
    "Conscientiousness": {
        "high": ("精确打击", "暴击率+10%，每战斗限1次"),
        "mid":  ("稳扎稳打", "暴击率+5%，暴击伤害-10%"),
    },
    "Extraversion": {
        "high": ("气场压制", "攻击时20%概率令敌人速度-10%"),
        "mid":  ("高光时刻", "攻击时30%概率提升下次攻击50%伤害"),
    },
    "Agreeableness": {
        "high": ("守护之心", "替队友承受一次致命伤害（每战斗1次）"),
        "mid":  ("情感共鸣", "治疗量+20%，队友受伤时分担5%伤害"),
    },
    "Neuroticism": {
        "high": ("情绪爆发", "生命值<30%时，攻击力+40%持续3回合"),
        "mid":  ("冷静分析", "受到攻击时，15%概率减免30%伤害"),
    },
}

SBTI_SKILLS = {
    "E": ("高光时刻", "攻击时30%概率提升下次攻击50%伤害"),
    "I": ("深度聚焦", "每损失10%生命值，防御力+5%"),
    "S": ("稳扎稳打", "暴击率+5%，暴击伤害-10%"),
    "N": ("灵感迸发", "速度低于对方时，25%概率追击"),
    "T": ("冷静分析", "受到攻击时，15%概率减免30%伤害"),
    "F": ("情感共鸣", "治疗量+20%，队友受伤时分担5%伤害"),
    "J": ("计划执行", "行动开始时若本回合未受伤，攻击力+15%"),
    "P": ("随机应变", "闪避率+8%，攻击时20%概率连击"),
}


# ─────────────────────────────────────────────
# 数据结构
# ─────────────────────────────────────────────
@dataclass
class BigFiveScores:
    openness: float
    conscientiousness: float
    extraversion: float
    agreeableness: float
    neuroticism: float

    @property
    def total(self) -> float:
        return (self.openness + self.conscientiousness + self.extraversion +
                self.agreeableness + self.neuroticism)

    def get_level(self, dim: str) -> str:
        score = getattr(self, dim.lower().replace("-", "_"))
        return "high" if score >= 80 else ("mid" if score >= 50 else "low")


@dataclass
class SBTScores:
    energy: float
    awareness: float
    decision: float
    execution: float

    def to_mbti(self) -> str:
        return (("E" if self.energy > 50 else "I") +
                ("N" if self.awareness > 50 else "S") +
                ("F" if self.decision > 50 else "T") +
                ("P" if self.execution > 50 else "J"))

    def get_poles(self) -> Dict[str, str]:
        return {
            "Energy":    "E" if self.energy > 50 else "I",
            "Awareness": "N" if self.awareness > 50 else "S",
            "Decision":  "F" if self.decision > 50 else "T",
            "Execution": "P" if self.execution > 50 else "J",
        }

    def to_dict(self) -> dict:
        return {
            "Energy": round(self.energy, 1),
            "Awareness": round(self.awareness, 1),
            "Decision": round(self.decision, 1),
            "Execution": round(self.execution, 1),
        }


@dataclass
class BattleStats:
    attack: int
    defense: int
    hp: int
    speed: int
    crit_rate: float
    dodge_rate: float


@dataclass
class Card:
    card_id: str
    sbti_type: str
    rarity: str
    stars: str
    role: str
    element: str
    keywords: List[str]
    bigfive_total: float
    battle: BattleStats
    skills: List[Tuple[str, str]]
    sbti_dims: Dict[str, str]

    def to_dict(self) -> dict:
        return {
            "card_id": self.card_id,
            "sbti_type": self.sbti_type,
            "rarity": self.rarity,
            "stars": self.stars,
            "role": self.role,
            "element": self.element,
            "keywords": self.keywords,
            "bigfive_total": round(self.bigfive_total, 1),
            "battle": asdict(self.battle),
            "skills": [{"name": s[0], "desc": s[1]} for s in self.skills],
            "sbti_dims": self.sbti_dims,
        }

    def to_markdown(self) -> str:
        lines = [
            f"## {self.sbti_type} {self.rarity} {self.stars} — {self.role}",
            "",
            f"**ID:** {self.card_id}  |  **元素:** {self.element}  |  **大五总分:** {self.bigfive_total:.0f}",
            "",
            "### 战斗属性",
            "",
            f"| 属性 | 数值 |",
            f"|------|------|",
            f"| 攻击力 | {self.battle.attack} |",
            f"| 防御力 | {self.battle.defense} |",
            f"| 生命力 | {self.battle.hp} |",
            f"| 速度   | {self.battle.speed} |",
            f"| 暴击率 | {self.battle.crit_rate:.1f}% |",
            f"| 闪避率 | {self.battle.dodge_rate:.1f}% |",
            "",
            "### 天赋技能",
            "",
        ]
        for name, desc in self.skills:
            lines.append(f"- **{name}**：{desc}")

        poles_desc = [f"**{k}**={v}（{SBTI_DIMENSIONS[k][v]}）"
                      for k, v in self.sbti_dims.items()]
        lines += [
            "",
            "### SBTI 四维",
            "",
            " | ".join(poles_desc),
            "",
            f"**立绘关键词：** {', '.join(self.keywords)}",
        ]
        return "\n".join(lines)


# ─────────────────────────────────────────────
# 卡牌生成器
# ─────────────────────────────────────────────
class CardGenerator:
    RARITY_TYPES = {
        "Common":    ["ESFJ", "ISFJ", "ESTJ", "ISTP", "ISTJ", "ESFP"],
        "Rare":      ["ENFP", "INTP", "ENTJ", "ISFP", "ESTP", "ENFJ"],
        "Special":   ["INFP", "INFJ", "INTJ", "ENTP"],
        "Legendary": ["INTJ", "INFJ", "ENTJ", "INTP"],
    }

    def __init__(self):
        self.draw_count = 0

    def _calc_stats(self, bf: BigFiveScores, bonus: int) -> BattleStats:
        o = bf.openness / 100
        c = bf.conscientiousness / 100
        e = bf.extraversion / 100
        a = bf.agreeableness / 100
        n = (100 - bf.neuroticism) / 100
        base = 300

        return BattleStats(
            attack   = min(round(base + (o*2 + c)*200/3) + bonus, 999),
            defense  = min(round(base + (a*2 + c)*200/3) + bonus, 999),
            hp       = min(round(base + (n + e*0.5)*300) + bonus, 999),
            speed    = min(round(base + (e + o*0.8)*200) + bonus, 999),
            crit_rate= min(round((o + n)*12, 1), 50.0),
            dodge_rate = min(round((1 - e + o)*10, 1), 50.0),
        )

    def _build_skills(self, bf: BigFiveScores, sbti: SBTScores,
                      rarity: str) -> List[Tuple[str, str]]:
        skills = []
        poles = sbti.get_poles()
        extremes = sorted(
            [(abs(getattr(sbti, k.lower()) - 50), k, v)
             for k, v in poles.items()],
            reverse=True
        )
        main_pole = extremes[0][2]
        if main_pole in SBTI_SKILLS:
            skills.append(SBTI_SKILLS[main_pole])

        slot_count = RARITY_CONFIG[rarity]["skill_slots"]
        for dim in ["openness", "conscientiousness", "extraversion",
                    "agreeableness", "neuroticism"]:
            score = getattr(bf, dim)
            if score >= 70 and len(skills) < slot_count + 2:
                level = bf.get_level(dim)
                dim_key = dim.capitalize()
                if dim_key in BIGFIVE_SKILLS:
                    if level == "high":
                        skills.append(BIGFIVE_SKILLS[dim_key]["high"])
                    elif level == "mid":
                        skills.append(BIGFIVE_SKILLS[dim_key]["mid"])

        return skills[:4]

    def _rarity_upgrade(self, rarity: str, total: float) -> str:
        if total >= 400:
            return {"Common": "Rare", "Rare": "Special",
                    "Special": "Legendary"}.get(rarity, rarity)
        if total <= 150:
            return {"Special": "Rare", "Rare": "Common"}.get(rarity, rarity)
        return rarity

    def draw(self, sbti: SBTScores, bf: BigFiveScores) -> Card:
        self.draw_count += 1

        # 1. 抽稀有度
        roll = random.random()
        cumulative = 0
        rarity = "Common"
        for r, cfg in RARITY_CONFIG.items():
            cumulative += cfg["prob"]
            if roll <= cumulative:
                rarity = r
                break

        # 2. 大五总分升级
        rarity = self._rarity_upgrade(rarity, bf.total)

        # 3. 确定类型
        type_pool = (self.RARITY_TYPES["Legendary"] + self.RARITY_TYPES["Special"]
                     if rarity == "Legendary" else self.RARITY_TYPES[rarity])
        actual = sbti.to_mbti()
        mbti_type = actual if random.random() < 0.6 and actual in type_pool \
                          else random.choice(type_pool)

        meta = TYPE_META.get(mbti_type,
            {"role": "神秘者", "keywords": ["混沌"], "element": "混沌"})

        battle = self._calc_stats(bf, RARITY_CONFIG[rarity]["attr_bonus"])
        skills = self._build_skills(bf, sbti, rarity)
        poles  = sbti.get_poles()

        return Card(
            card_id       = f"#{self.draw_count:04d}-{mbti_type}",
            sbti_type     = mbti_type,
            rarity        = rarity,
            stars         = RARITY_CONFIG[rarity]["star"],
            role          = meta["role"],
            element       = meta["element"],
            keywords      = meta["keywords"],
            bigfive_total = bf.total,
            battle        = battle,
            skills        = skills,
            sbti_dims     = poles,
        )

    def draw_x10(self, sbti: SBTScores, bf: BigFiveScores) -> List[Card]:
        cards = []
        has_rare = False
        for _ in range(10):
            card = self.draw(sbti, bf)
            if card.rarity in ("Rare", "Special", "Legendary"):
                has_rare = True
            cards.append(card)
        if not has_rare:
            cards[-1].rarity = "Rare"
            cards[-1].stars  = RARITY_CONFIG["Rare"]["star"]
            cards[-1].battle = self._calc_stats(bf, RARITY_CONFIG["Rare"]["attr_bonus"])
            cards[-1].skills = self._build_skills(bf, sbti, "Rare")
        return cards


# ─────────────────────────────────────────────
# 导出器
# ─────────────────────────────────────────────
class Exporter:
    @staticmethod
    def to_json(cards: List[Card], path: str):
        data = [c.to_dict() for c in cards]
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    @staticmethod
    def to_markdown(cards: List[Card], path: str):
        lines = [
            "# SBTI × Big Five 抽卡结果",
            "",
            f"共抽出 **{len(cards)}** 张角色卡",
            "",
        ]
        # 汇总表
        lines += [
            "## 卡牌一览",
            "",
            "| # | 类型 | 稀有度 | 星级 | 角色 | 攻 | 防 | 生命 | 速 | 暴击 | 闪避 | 大五总分 |",
            "|---|------|--------|------|------|----|----|------|----|------|------|----------|",
        ]
        for c in cards:
            lines.append(
                f"| {c.card_id} | **{c.sbti_type}** | {c.rarity} | "
                f"{c.stars} | {c.role} | {c.battle.attack} | {c.battle.defense} | "
                f"{c.battle.hp} | {c.battle.speed} | {c.battle.crit_rate:.1f}% | "
                f"{c.battle.dodge_rate:.1f}% | {c.bigfive_total:.0f} |"
            )

        lines += ["", "---", ""]
        for c in cards:
            lines.append(c.to_markdown())
            lines.append("---")

        with open(path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))

    @staticmethod
    def to_txt(cards: List[Card], path: str):
        lines = [
            "=" * 50,
            "  SBTI × Big Five 混合抽卡结果",
            "=" * 50,
            "",
        ]
        for c in cards:
            lines.append(f"【{c.sbti_type}】{c.rarity} {c.stars} — {c.role}")
            lines.append(f"  ID: {c.card_id}  |  元素: {c.element}  |  大五总分: {c.bigfive_total:.0f}")
            lines.append(f"  攻击力 {c.battle.attack}  防御力 {c.battle.defense}  "
                         f"生命力 {c.battle.hp}  速度 {c.battle.speed}")
            lines.append(f"  暴击率 {c.battle.crit_rate:.1f}%  闪避率 {c.battle.dodge_rate:.1f}%")
            if c.skills:
                lines.append("  天赋技能:")
                for name, desc in c.skills:
                    lines.append(f"    ◆ {name}：{desc}")
            poles = [f"{k}={v}（{SBTI_DIMENSIONS[k][v]}）" for k, v in c.sbti_dims.items()]
            lines.append(f"  SBTI: {', '.join(poles)}")
            lines.append(f"  立绘: {', '.join(c.keywords)}")
            lines.append("")

        with open(path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))


# ─────────────────────────────────────────────
# 主程序
# ─────────────────────────────────────────────
def main():
    import os

    # ── 测试人格数据 ──
    TEST_SETS = [
        ("INTJ 建筑师型", SBTScores(35, 75, 30, 40),
         BigFiveScores(85, 80, 30, 45, 50)),
        ("ENFP 冒险家型", SBTScores(75, 65, 70, 60),
         BigFiveScores(90, 55, 88, 78, 45)),
        ("ISFJ 守护者型", SBTScores(30, 45, 60, 35),
         BigFiveScores(55, 85, 35, 90, 35)),
    ]

    gen = CardGenerator()
    all_cards = []

    output_dir = os.path.dirname(os.path.abspath(__file__))

    for name, sbti, bf in TEST_SETS:
        print(f"\n{'='*20} 抽卡测试: {name} {'='*20}")
        print(f"SBTI: {sbti.to_mbti()}  |  大五总分: {bf.total:.0f}\n")

        # 单抽
        card = gen.draw(sbti, bf)
        card_markdown = card.to_markdown()
        print(card_markdown)
        all_cards.append(card)

        # 十连
        print("\n【十连结果】")
        x10 = gen.draw_x10(sbti, bf)
        for i, c in enumerate(x10):
            flag = " ← 保底" if i == 9 else ""
            print(f"  {c.card_id}  {c.sbti_type} {c.rarity} {c.stars}"
                  f"  攻{c.battle.attack} 防{c.battle.defense}"
                  f" 生命{c.battle.hp} 速{c.battle.speed}{flag}")
        all_cards.extend(x10)

    # ── 导出文件 ──
    base = os.path.join(output_dir, "gacha_output")
    Exporter.to_json(    all_cards, base + "_cards.json")
    Exporter.to_markdown(all_cards, base + "_report.md")
    Exporter.to_txt(    all_cards, base + "_result.txt")

    print("\n" + "=" * 50)
    print("  导出完成！文件已保存为 UTF-8 编码：")
    print(f"  • {base}_cards.json   （JSON 数据）")
    print(f"  • {base}_report.md    （Markdown 报告）")
    print(f"  • {base}_result.txt   （纯文本）")
    print("=" * 50)


if __name__ == "__main__":
    main()
