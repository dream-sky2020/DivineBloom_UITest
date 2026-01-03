<template>
  <div class="panel-container">
    
    <!-- 顶部：角色切换 Tabs -->
    <div class="character-tabs">
      <div class="char-tab active">
        <span class="char-name">ALPHEN</span>
        <span class="char-role text-blue">Warrior</span>
      </div>
      <div class="char-tab">
        <span class="char-name">SHIONNE</span>
        <span class="char-role">Gunner</span>
      </div>
      <div class="char-tab">
        <span class="char-name">RINWELL</span>
        <span class="char-role">Mage</span>
      </div>
      <div class="char-tab">
        <span class="char-name">LAW</span>
        <span class="char-role">Brawler</span>
      </div>
    </div>

    <!-- 已装备技能栏 (Equipped Loadout) -->
    <div class="loadout-panel">
      <!-- 主动技能槽 -->
      <div class="loadout-section">
        <h3 class="section-title" v-t="'skillTypes.active'"></h3>
        <div class="skills-row">
          <!-- Slot 1 -->
          <div class="skill-slot equipped-active group hover-effect">
            <span class="skill-icon"><GameIcon name="icon_fire" /></span>
            <div class="slot-badge">1</div>
          </div>
          <!-- Slot 2 -->
          <div class="skill-slot equipped-normal group hover-effect">
            <span class="skill-icon"><GameIcon name="icon_ice" /></span>
            <div class="slot-badge normal">2</div>
          </div>
          <!-- Slot 3 (Empty) -->
          <div class="skill-slot empty group hover-effect">
            <span class="empty-plus">+</span>
            <div class="slot-badge empty-badge">3</div>
          </div>
          <!-- Slot 4 (Empty) -->
          <div class="skill-slot empty group hover-effect">
            <span class="empty-plus">+</span>
            <div class="slot-badge empty-badge">4</div>
          </div>
        </div>
      </div>

      <!-- 分隔线 -->
      <div class="divider"></div>

      <!-- 被动技能槽 -->
      <div class="loadout-section">
        <h3 class="section-title" v-t="'skillTypes.passive'"></h3>
        <div class="skills-row">
          <!-- Slot 1 -->
          <div class="skill-slot passive-active rounded-circle group hover-effect">
            <span class="skill-icon"><GameIcon name="icon_shield" /></span>
          </div>
          <!-- Slot 2 -->
          <div class="skill-slot passive-normal rounded-circle group hover-effect">
            <span class="skill-icon"><GameIcon name="icon_lightning" /></span>
          </div>
          <!-- Slot 3 (Empty) -->
          <div class="skill-slot passive-empty rounded-circle group hover-effect">
            <span class="empty-plus">+</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 过滤器 Tabs -->
    <div class="filter-bar">
      <div class="filter-tabs">
        <div class="tab active" v-t="'skills.tabs.all'"></div>
        <div class="tab" v-t="'skillTypes.active'"></div>
        <div class="tab" v-t="'skillTypes.passive'"></div>
      </div>
    </div>

    <!-- 技能列表与描述 -->
    <div class="content-area">
      
      <!-- 列表 -->
      <div class="skills-grid custom-scrollbar">
        
        <!-- Active: Fireball (Equipped) -->
        <div class="skill-card active-equipped">
          <div class="card-header">
            <div class="card-icon-box"><GameIcon name="icon_fire" /></div>
            <div class="card-info">
              <div class="card-title text-yellow">Fireball</div>
              <div class="card-sub">Lv. 5</div>
            </div>
          </div>
          <div class="card-footer">
            <span class="type-text text-blue" v-t="'skillTypes.active'"></span>
            <span class="cost-text text-blue-bold">15 MP</span>
          </div>
          <div class="equipped-tag text-yellow" v-t="'skills.equipped'"></div>
        </div>

        <!-- Active: Ice Shard (Equipped) -->
        <div class="skill-card">
          <div class="card-header">
            <div class="card-icon-box">❄️</div>
            <div class="card-info">
              <div class="card-title">Ice Shard</div>
              <div class="card-sub">Lv. 3</div>
            </div>
          </div>
          <div class="card-footer">
            <span class="type-text">Active</span>
            <span class="cost-text">12 MP</span>
          </div>
          <div class="equipped-tag text-slate">EQUIPPED</div>
        </div>

        <!-- Passive: Iron Skin (Equipped) -->
        <div class="skill-card">
          <div class="card-header">
            <div class="card-icon-box">🛡️</div>
            <div class="card-info">
              <div class="card-title">Iron Skin</div>
              <div class="card-sub">Lv. Max</div>
            </div>
          </div>
          <div class="card-footer">
            <span class="type-text text-green">Passive</span>
            <span class="cost-text">--</span>
          </div>
          <div class="equipped-tag text-slate">EQUIPPED</div>
        </div>

        <!-- Active: Thunder Strike -->
        <div class="skill-card">
          <div class="card-header">
            <div class="card-icon-box">⚡</div>
            <div class="card-info">
              <div class="card-title">Thunder</div>
              <div class="card-sub">Lv. 1</div>
            </div>
          </div>
          <div class="card-footer">
            <span class="type-text">Active</span>
            <span class="cost-text">25 MP</span>
          </div>
        </div>

        <!-- Passive: Meditation -->
        <div class="skill-card">
          <div class="card-header">
            <div class="card-icon-box">🧘</div>
            <div class="card-info">
              <div class="card-title">Meditate</div>
              <div class="card-sub">Lv. 2</div>
            </div>
          </div>
          <div class="card-footer">
            <span class="type-text text-green">Passive</span>
            <span class="cost-text">--</span>
          </div>
        </div>

        <!-- Active: Heal -->
        <div class="skill-card">
          <div class="card-header">
            <div class="card-icon-box">💚</div>
            <div class="card-info">
              <div class="card-title">Heal</div>
              <div class="card-sub">Lv. 4</div>
            </div>
          </div>
          <div class="card-footer">
            <span class="type-text">Active</span>
            <span class="cost-text">30 MP</span>
          </div>
        </div>

        <!-- Locked Skill -->
        <div class="skill-card locked">
          <div class="card-header">
            <div class="card-icon-box grayscale">☠️</div>
            <div class="card-info">
              <div class="card-title locked-text">Doom</div>
              <div class="card-sub">{{ $t('skills.locked') }} (Lv. 50)</div>
            </div>
          </div>
          <div class="card-footer">
            <span class="type-text locked-text" v-t="'skillTypes.active'"></span>
            <span class="cost-text locked-text">?? MP</span>
          </div>
          <div class="lock-overlay">🔒</div>
        </div>

        <!-- 填充项 -->
        <div v-for="i in 5" :key="i" class="skill-card placeholder">
          <div class="card-header">
            <div class="card-icon-box placeholder-icon">?</div>
            <div class="card-info">
              <div class="placeholder-line w-60"></div>
            </div>
          </div>
          <div class="card-footer">
            <div class="placeholder-line w-30"></div>
            <div class="placeholder-line w-30"></div>
          </div>
        </div>

      </div>

      <!-- 底部描述区域 -->
      <div class="description-panel">
        <div class="desc-icon-box">🔥</div>
        <div class="desc-content">
          <div>
            <div class="desc-header">
              <h3 class="desc-title">Fireball <span class="desc-level">Lv. 5</span></h3>
              <span class="desc-cost">Cost: 15 MP</span>
            </div>
            <div class="desc-meta">Target: Single Enemy | Type: Magic / Fire</div>
            <p class="desc-body">
              Hurls a ball of searing flame at the target. Deals <span class="highlight-yellow">120% Magic Damage</span> and has a 20% chance to inflict <span class="highlight-red">Burn</span> for 3 turns.
            </p>
          </div>
        </div>
        <div class="desc-actions">
          <button class="action-btn btn-red" v-t="'skills.unequip'"></button>
          <button class="action-btn btn-slate" v-t="'skills.upgrade'"></button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped src="@styles/components/panels/SkillsPanel.css"></style>

