Implement thoroughly, ina step by step manner and using as many built-in values instead of hardcoding dimensions.

For colors and font families, use the defined values present in @tailwind.config.js, e.g. 'bg-primary-500' etc. instead of the primary/secondary values in the json brief. For accet colors/grays etc. the json values are acceptable.

Requirements
- responsivee (full width bg with centered content on larger screens)
- theme aware components with light and dark mode support ( you can toggle with @ThemeSwitch.tsx, include that in the menu bar)
- Important make sure to include light and dark mode colors by using Tailwind's dark mode classes (dark:)
- all components must adapt to theme changes
- do not use magic strings, hex values or px values. Replace all with tailwind classes if possible.
- split resuable or complex parts of the UI into components so the code is maintainable and easy to understand


Assignment brief

Create a premium dashboard for an asset management app inspired by a soft, modern operations interface. The layout should feel warm, spacious, and highly organized, using large rounded cards, gentle shadows, and a calm neutral foundation with a restrained golden accent.\n\nBuild the screen around a centered application shell with a compact top navigation, a strong page title, top summary metrics, and a mixed widget grid. Include a featured asset card, compact analytics cards, a circular status/progress card, a workflow summary area, a dark high-contrast checklist panel, an inventory list/accordion section, and a scheduling card. The overall rhythm should prioritize one clear purpose per card, with excellent spacing and strong hierarchy.\n\nToken rules:\n- Use only the token system; do not hardcode colors, radius, spacing, borders, or shadows.\n- Use `primary` only for emphasis, active states, highlights, and chart accents.\n- Use `secondary` for text, strong contrast surfaces, and selected navigation states.\n- Let `gray` tokens define most backgrounds, dividers, and quiet UI surfaces.\n- Use semantic colors only for explicit success, warning, danger, and info states.\n- Use gradients only for hero background tinting, chart accents, and media overlays.\n- Preserve the same visual identity in both light and dark mode, keeping dark mode warm and premium rather than stark or neon.\n- Maintain responsive behavior across the standard breakpoint scale, collapsing from a 4-region desktop dashboard to a clear single-column mobile flow.

Design specification
{
  // UI design handoff brief derived from the provided screenshot.
  // Scope: visual system, layout structure, component anatomy, responsive guidance,
  // tokenization for light/dark mode, and implementation-oriented behavior notes.

  "meta": {
    "artifact": "HR dashboard style analysis adapted for an asset management app",
    "source_type": "single static screenshot",
    "design_direction": [
      "soft premium SaaS dashboard",
      "rounded-card system",
      "warm neutral light theme",
      "minimal black/cream/yellow contrast",
      "dense but calm information layout"
    ],
    "intended_use": "UI designer to developer handoff",
    "confidence_notes": [
      "Some measurements are estimated visually from the screenshot.",
      "Typography family is approximated from appearance; use a clean modern grotesk sans.",
      "Colors are approximate and should be normalized into tokenized palettes."
    ]
  },

  "overview": {
    "app_shell": {
      "type": "single-page dashboard within a centered application canvas",
      "canvas_shape": "large rounded rectangle",
      "visual_style": "floating board on muted page background with soft shadow",
      "composition": "top navigation + hero stats + mixed widget grid"
    },
    "visual_personality": {
      "tone": "friendly, premium, modern, human-centered",
      "keywords": [
        "soft",
        "rounded",
        "editorial",
        "high-contrast text on warm surfaces",
        "playful but professional"
      ],
      "ux_impression": [
        "dashboard should feel approachable rather than enterprise-heavy",
        "data density is moderate, not maximal",
        "visual rhythm comes from card grouping, rounded geometry, and accent highlights"
      ]
    },
    "adaptation_for_asset_management": {
      "recommended_content_swap": {
        "employee_profile_card": "primary asset card or assigned asset owner card",
        "progress_card": "asset utilization / maintenance trend / depreciation status",
        "time_tracker_card": "service cycle / warranty countdown / uptime",
        "onboarding_card": "asset provisioning workflow",
        "device_list_card": "inventory categories / assigned devices / accessories",
        "calendar_card": "maintenance schedule / audits / renewals / returns"
      },
      "do_not_change": [
        "overall card rhythm",
        "large-radius premium look",
        "soft neutral background layering",
        "accent-driven highlights",
        "nav hierarchy and spacing discipline"
      ]
    }
  },

  "layout": {
    "outer_page": {
      "background": "cool desaturated blue-gray page background behind centered app shell",
      "padding_around_shell": "generous; approximately 56px+ on desktop"
    },
    "app_shell": {
      "max_width_behavior": "wide desktop board centered horizontally",
      "corner_radius": "very large, approximately 28-36px",
      "internal_padding": {
        "desktop": "20-24px outer inset",
        "tablet": "16-20px",
        "mobile": "12-16px"
      },
      "surface_treatment": {
        "base": "warm off-white / cream",
        "section_overlay": "subtle right-side warm yellow wash",
        "shadow": "broad, soft, low-contrast drop shadow"
      }
    },
    "high_level_regions": [
      {
        "name": "top_nav",
        "position": "top edge within shell",
        "height_behavior": "compact single-row header"
      },
      {
        "name": "hero",
        "position": "upper left under nav",
        "content": "welcome title + compact progress chips + top-level KPIs"
      },
      {
        "name": "widget_grid",
        "position": "main body",
        "content": "cards of mixed width and height organized in 3-column desktop arrangement"
      }
    ],
    "desktop_grid_interpretation": {
      "columns": 12,
      "gap": "12-16px",
      "rows": "content-driven, card heights vary",
      "suggested_mapping": [
        "left column block ~ 3/12",
        "center block ~ 3/12",
        "mid-right block ~ 3/12",
        "far-right block ~ 3/12"
      ],
      "actual_visual_grouping": [
        "left: profile card + accordions",
        "center: progress card + calendar",
        "mid-right: timer card + calendar continuation",
        "right: onboarding summary + vertical task list"
      ]
    }
  },

  "responsive": {
    "tailwind_default_breakpoints": {
      "sm": "640px",
      "md": "768px",
      "lg": "1024px",
      "xl": "1280px",
      "2xl": "1536px"
    },
    "behavior_by_breakpoint": {
      "base_<640": {
        "shell": "full-width with reduced outer margin",
        "nav": "logo + compact actions; primary nav collapses into segmented scroll row or menu",
        "grid": "single column",
        "card_order": [
          "top stats",
          "primary asset / hero card",
          "workflow card",
          "utilization / chart card",
          "timer / status ring",
          "calendar / schedule",
          "secondary lists / accordions"
        ],
        "card_radius": "keep large but reduce slightly for tighter space",
        "kpis": "stack 2 per row or 1 per row based on width",
        "calendar": "switch to list agenda style if full weekly timeline becomes cramped",
        "task_panel": "full-width under summary instead of fixed right rail"
      },
      "sm_640+": {
        "grid": "still mostly single column, but allow 2-up mini stats/cards where appropriate",
        "nav": "horizontal if items fit, otherwise scrollable chip row",
        "profile_card": "can remain full width with media on left and text overlay"
      },
      "md_768+": {
        "grid": "2 columns",
        "left_column": "hero/profile + lists",
        "right_column": "analytics + workflow + schedule",
        "calendar": "can return to compact week timeline",
        "task_list": "stack below workflow card"
      },
      "lg_1024+": {
        "grid": "3 to 4 visual groups matching screenshot spirit",
        "nav": "full horizontal with centered menu and right utility icons",
        "kpis": "inline right-aligned in hero row",
        "calendar": "multi-column integrated card",
        "task_panel": "right-side dedicated tall card"
      },
      "xl_1280+": {
        "grid": "full desktop composition close to screenshot",
        "spacing": "increase whitespace and preserve premium airy layout",
        "hero": "title on left, KPIs on right"
      },
      "2xl_1536+": {
        "max_width": "do not over-stretch content; increase shell max width modestly",
        "readability": "preserve card proportions and whitespace rather than filling all space"
      }
    }
  },

  "design_tokens": {
    "shape": {
      "radius": {
        "xs": "8px",
        "sm": "12px",
        "md": "16px",
        "lg": "20px",
        "xl": "24px",
        "2xl": "28px",
        "3xl": "32px",
        "pill": "999px"
      },
      "usage": {
        "shell": "2xl to 3xl",
        "primary_cards": "xl to 2xl",
        "secondary_cards": "lg to xl",
        "chips": "pill",
        "avatar_groups": "pill mask or full circle",
        "buttons": "pill or lg radius"
      }
    },
    "spacing": {
      "micro": "4px",
      "xs": "8px",
      "sm": "12px",
      "md": "16px",
      "lg": "20px",
      "xl": "24px",
      "2xl": "32px",
      "3xl": "40px",
      "usage_rules": [
        "8px rhythm inside compact metrics",
        "12-16px between card internals",
        "16px between sibling cards in grid",
        "20-24px internal padding for main cards"
      ]
    },
    "borders": {
      "subtle": "1px solid low-contrast neutral",
      "strong": "rarely used; rely on surface contrast instead",
      "divider_style": "hairline neutral or dotted/soft separators in list sections"
    },
    "shadows": {
      "shell": "0 20px 50px rgba(15, 23, 42, 0.10)",
      "card_soft": "0 8px 24px rgba(15, 23, 42, 0.06)",
      "floating_dark_card": "0 10px 30px rgba(0, 0, 0, 0.22)",
      "rule": "shadow should be broad and soft, never sharp or highly elevated"
    },
    "motion": {
      "duration_fast": "150ms",
      "duration_base": "220ms",
      "duration_slow": "320ms",
      "easing": "standard ease-out for hover/focus; subtle scale/brightness only",
      "interaction_style": "gentle, not bouncy"
    }
  },

  "color_system": {
    "strategy": {
      "goal": "Use only two main palettes, primary and secondary, plus a neutral gray scale and a few semantic utility colors.",
      "visual_read": "UI is dominated by warm neutral surfaces, near-black text, and muted golden accent."
    },

    "primary_palette": {
      "name": "gold",
      "intent": "brand emphasis, active fill, progress highlights, selected states, chart highlights",
      "approx_tailwind_family": "amber/yellow hybrid",
      "tokens": {
        "50": "#FFFBEA",
        "100": "#FFF3C4",
        "200": "#FDE68A",
        "300": "#F7D95D",
        "400": "#F2CD45",
        "500": "#EABF2F",
        "600": "#C99620",
        "700": "#9E7418",
        "800": "#785814",
        "900": "#5C4313"
      },
      "usage_rules": [
        "Use 400-500 for active chips, radial progress, emphasis bars, primary highlights.",
        "Use 50-100 as tinted backgrounds in light mode.",
        "In dark mode, use 400-500 sparingly against dark surfaces to preserve premium tone.",
        "Never use primary as a large full-page background."
      ]
    },

    "secondary_palette": {
      "name": "ink",
      "intent": "high-contrast cards, nav selected state, dense panels, strong text emphasis",
      "approx_tailwind_family": "zinc/slate hybrid",
      "tokens": {
        "50": "#F5F5F4",
        "100": "#E7E5E4",
        "200": "#D6D3D1",
        "300": "#B5B0AB",
        "400": "#8A837D",
        "500": "#625C57",
        "600": "#4B4541",
        "700": "#36322F",
        "800": "#24211F",
        "900": "#171513",
        "950": "#0F0D0C"
      },
      "usage_rules": [
        "Use 800-950 for text, dark cards, selected nav, and metric emphasis.",
        "Use 50-200 for light dividers and soft fills.",
        "Dark mode should invert usage: 900/950 surfaces, 50/100 text."
      ]
    },

    "gray_scale": {
      "cool_page_bg": "#A7AFBC",
      "gray_25": "#FCFCFB",
      "gray_50": "#F7F5F0",
      "gray_100": "#EFEAE0",
      "gray_150": "#E7E0D3",
      "gray_200": "#DDD6C9",
      "gray_300": "#C8C0B3",
      "gray_400": "#AAA294",
      "gray_500": "#8A8378",
      "gray_600": "#6C665E",
      "gray_700": "#4E4A45",
      "gray_800": "#34312E",
      "gray_900": "#1D1B19"
    },

    "semantic_colors": {
      "success": {
        "light": "#DDF6E8",
        "base": "#34A853",
        "dark": "#1E7A3E"
      },
      "warning": {
        "light": "#FFF4D6",
        "base": "#EABF2F",
        "dark": "#B28211"
      },
      "danger": {
        "light": "#FDE2E2",
        "base": "#E05A5A",
        "dark": "#B63D3D"
      },
      "info": {
        "light": "#DCEEFE",
        "base": "#5AA2E0",
        "dark": "#2E6FAE"
      }
    },

    "special_effects": {
      "hero_surface_gradient_light": "linear-gradient(90deg, #F7F5F0 0%, #F6EFBF 100%)",
      "hero_surface_gradient_dark": "linear-gradient(90deg, #1E1B19 0%, #312A16 100%)",
      "ring_gradient": "conic blend from primary-300 to primary-500 over neutral track",
      "profile_media_overlay": "bottom-to-top dark transparent gradient for text legibility",
      "dark_card_overlay": "subtle inner highlight on top edge, very low opacity"
    }
  },

  "theme_modes": {
    "light": {
      "page_bg": "cool muted blue-gray outside shell",
      "shell_bg": "warm neutral cream",
      "card_bg_primary": "off-white / warm ivory",
      "card_bg_secondary": "slightly darker warm neutral",
      "text_primary": "secondary.900",
      "text_secondary": "gray_600 to gray_700",
      "text_muted": "gray_500",
      "chip_active_bg": "primary.400/500",
      "chip_active_text": "secondary.900",
      "chip_idle_bg": "secondary.800/900 for dark pills or gray_100 for soft pills",
      "chip_idle_text": "depends on fill; high contrast only",
      "dark_panel_bg": "secondary.850-950",
      "dark_panel_text": "gray_25 / secondary.50",
      "divider": "gray_200",
      "input_surface": "gray_25",
      "shadow_strength": "visible but soft"
    },
    "dark": {
      "page_bg": "#0D1016",
      "shell_bg": "#151718",
      "card_bg_primary": "#1C1F21",
      "card_bg_secondary": "#242729",
      "text_primary": "#F5F5F4",
      "text_secondary": "#D6D3D1",
      "text_muted": "#AAA294",
      "chip_active_bg": "primary.400",
      "chip_active_text": "secondary.950",
      "chip_idle_bg": "#2B2F31",
      "chip_idle_text": "#E7E5E4",
      "dark_panel_bg": "#0F1112",
      "dark_panel_text": "#FAFAF9",
      "divider": "rgba(255,255,255,0.08)",
      "input_surface": "#202426",
      "shadow_strength": "reduced external shadow, increased surface separation by fill contrast",
      "notes": [
        "Preserve the premium warmth by keeping slight brown/olive undertones in dark neutrals.",
        "Primary gold should remain saturated enough to signal focus but not neon."
      ]
    }
  },

  "typography": {
    "style": {
      "family_direction": "clean rounded grotesk / modern UI sans",
      "tone": "friendly, geometric but not rigid",
      "weight_usage": "mostly regular to medium; semibold only for emphasis"
    },
    "scale": {
      "display": {
        "size": "40-48px",
        "line_height": "1.1-1.2",
        "weight": 500
      },
      "h1": {
        "size": "28-36px",
        "line_height": "1.15-1.2",
        "weight": 500
      },
      "h2": {
        "size": "22-24px",
        "line_height": "1.2-1.3",
        "weight": 500
      },
      "h3": {
        "size": "18-20px",
        "line_height": "1.3",
        "weight": 500
      },
      "body": {
        "size": "14-16px",
        "line_height": "1.45-1.6",
        "weight": 400
      },
      "small": {
        "size": "12-13px",
        "line_height": "1.4-1.5",
        "weight": 400
      },
      "metric": {
        "size": "40-52px for major KPI, 28-36px for card metrics",
        "line_height": "1",
        "weight": 400-500
      }
    },
    "rules": [
      "Headings are elegant and lightly weighted, not overly bold.",
      "Micro labels are small and muted.",
      "Numbers are visually prominent and should align neatly.",
      "Avoid heavy all-caps except tiny tabs/chips if needed."
    ]
  },

  "iconography": {
    "style": {
      "weight": "thin to regular stroke",
      "size_range": "14-20px",
      "corner_feel": "slightly rounded strokes",
      "usage": "navigation, KPI labels, task markers, media controls, utility actions"
    },
    "color_behavior": {
      "default": "text secondary or muted gray",
      "active": "secondary.900 on light / primary.400 for emphasis / gray_25 on dark cards",
      "decorative_limit": "icons should support clarity, not dominate"
    }
  },

  "component_inventory": {
    "top_navigation": {
      "structure": {
        "left": "brand pill / logo mark",
        "center": "horizontal nav pills",
        "right": "settings chip + notification icon + user/avatar icon"
      },
      "styling": {
        "height": "40-48px",
        "container_radius": "pill",
        "nav_item_radius": "pill",
        "default_nav_bg": "transparent or low-contrast light surface",
        "active_nav_bg": "secondary.800/900",
        "active_nav_text": "gray_25",
        "inactive_nav_text": "gray_600-700"
      },
      "behavior": {
        "hover": "slight surface tint",
        "active": "filled pill",
        "responsive": "collapse center items first"
      }
    },

    "hero_title_block": {
      "content": "large welcoming title plus compact linear progress summary chips",
      "layout": "left aligned title, small progress strips beneath",
      "style_notes": [
        "Title is large with plenty of white space below nav.",
        "Progress indicators are compact capsule/line hybrids."
      ]
    },

    "top_kpis": {
      "structure": "3 horizontally aligned summary metrics on hero right side",
      "each_kpi": {
        "content_order": "small icon -> large number -> tiny label",
        "visual_weight": "number dominates; icon and label are muted"
      },
      "spacing": "comfortable horizontal gaps, around 20-28px"
    },

    "mini_progress_filters": {
      "types_seen": [
        "filled pill percentage",
        "outlined capsule percentage",
        "striped/track progress bar"
      ],
      "guidance": [
        "Use as compact status badges for asset states like assigned, in repair, available, retired.",
        "Each badge should maintain consistent height."
      ]
    },

    "media_profile_card": {
      "purpose_in_reference": "employee highlight card with photo and salary badge",
      "asset_app_equivalent": "featured asset card or assigned user-to-asset card",
      "layout": {
        "media": "large image occupies full card",
        "overlay": "bottom gradient for readable text",
        "text": "title/subtitle bottom left",
        "badge": "pill metric bottom right"
      },
      "styling": {
        "radius": "2xl",
        "image_crop": "soft portrait crop with enough breathing room",
        "overlay": "dark transparent bottom fade",
        "text_on_media": "white or warm white"
      }
    },

    "analytics_card_small": {
      "purpose": "simple chart/stat summary",
      "examples": [
        "progress card",
        "time tracker card"
      ],
      "structure": {
        "header": "title + tiny icon button top right",
        "metric": "large number under title",
        "supporting_label": "small muted descriptor",
        "visualization": "minimal bar chart or circular progress",
        "annotation": "highlight badge anchored near chart"
      },
      "styling": {
        "bg": "warm off-white",
        "padding": "20-24px",
        "radius": "2xl"
      }
    },

    "bar_micro_chart": {
      "appearance": "vertical rounded bars with one accent bar and muted comparison bars",
      "usage": "weekly maintenance events, utilization, downtime, checkouts",
      "rules": [
        "Bars should be thick enough to feel tactile.",
        "One bar may be accented in primary.",
        "Tiny weekday labels aligned below."
      ]
    },

    "radial_progress_card": {
      "appearance": "large circular timer/ring with bold center value",
      "track": "thin dotted or segmented outer scale + thicker inner accent arc",
      "controls": "play/pause or utility buttons along bottom",
      "usage_for_asset_app": [
        "warranty remaining",
        "service countdown",
        "uptime",
        "maintenance cycle progress"
      ]
    },

    "workflow_summary_card": {
      "appearance": "header with completion percentage + segmented horizontal progress blocks",
      "usage_for_asset_app": "procurement, approval, assignment, return, disposal workflows",
      "details": [
        "Segment blocks can mix accent fill, dark fill, and gray fill.",
        "Top-right percentage is prominent."
      ]
    },

    "dark_task_panel": {
      "appearance": "tall dark rounded card nested in light layout",
      "purpose": "checklist / workflow steps / activity feed",
      "structure": {
        "header": "title + completion ratio",
        "items": "icon circle left, title + meta, status marker right"
      },
      "visual_rules": [
        "This card is the primary contrast anchor in the layout.",
        "Text is light, meta text is muted, completed markers can use gold or semantic accent."
      ],
      "asset_app_use_cases": [
        "asset request steps",
        "procurement milestones",
        "return checklist",
        "audit steps"
      ]
    },

    "accordion_list_card": {
      "appearance": "stack of labeled sections with chevrons and separators",
      "usage": "inventory categories, asset groups, vendor details, warranty packages",
      "open_state": "reveals nested row item with thumbnail/icon and meta",
      "closed_state": "single line row"
    },

    "list_item_device": {
      "layout": "thumbnail left, text stack middle, kebab or action right",
      "asset_app_equivalent": "laptop / monitor / accessory inventory row"
    },

    "calendar_schedule_card": {
      "appearance": "wide card with month selectors and weekly time grid",
      "content": "event pills placed in time rows",
      "style": [
        "light neutral background",
        "thin dotted or low-contrast grid lines",
        "event pills are rounded, dark or light depending on emphasis",
        "small participant avatars can appear on event pills"
      ],
      "asset_app_equivalent": [
        "maintenance booking",
        "audits",
        "device returns",
        "lease renewals"
      ]
    },

    "chips_badges": {
      "types": [
        "filled accent pill",
        "dark pill",
        "outlined capsule",
        "soft neutral tag"
      ],
      "rules": [
        "Height should be visually consistent across variants.",
        "Use pill badges for filters, percentages, mini statuses, monetary or count labels."
      ]
    },

    "icon_button": {
      "shape": "small circular or rounded-square",
      "surface": "soft neutral on light surfaces, darker neutral on dark surfaces",
      "states": [
        "default",
        "hover brighten",
        "focus ring",
        "active press"
      ]
    }
  },

  "content_density_and_hierarchy": {
    "hierarchy_order": [
      "headline / primary KPI",
      "card title",
      "large numeric value",
      "chart or status visualization",
      "labels / metadata / timestamps"
    ],
    "density_rules": [
      "Each card should have one dominant visual idea only.",
      "Avoid mixing multiple chart types inside a single small card.",
      "Prefer soft grouping and whitespace over borders.",
      "Dark cards should be used sparingly as focal contrast."
    ]
  },

  "detailed_card_mapping_for_asset_management": {
    "screen_sections": [
      {
        "reference_section": "welcome title",
        "asset_app_version": "Inventory dashboard / Asset operations overview",
        "example_copy": "Welcome back, Operations"
      },
      {
        "reference_section": "interviews / hired / project time / output",
        "asset_app_version": "Available / Assigned / In Service / Utilization",
        "component_type": "compact progress badges and bars"
      },
      {
        "reference_section": "employee KPIs",
        "asset_app_version": "Assets / Assigned / Repairs / Audits"
      },
      {
        "reference_section": "employee profile card",
        "asset_app_version": "featured asset card with image, model, condition, estimated value"
      },
      {
        "reference_section": "progress bars card",
        "asset_app_version": "utilization trend or maintenance history"
      },
      {
        "reference_section": "time tracker",
        "asset_app_version": "service countdown or warranty remaining"
      },
      {
        "reference_section": "onboarding summary",
        "asset_app_version": "asset provisioning status"
      },
      {
        "reference_section": "dark onboarding task list",
        "asset_app_version": "assignment checklist / return workflow / procurement tasks"
      },
      {
        "reference_section": "device accordion",
        "asset_app_version": "inventory categories and individual assets"
      },
      {
        "reference_section": "calendar",
        "asset_app_version": "maintenance schedule / reservations / inspections"
      }
    ]
  },

  "spacing_and_alignment_rules": {
    "global": [
      "Maintain a visible outer frame around the dashboard shell.",
      "Cards align to a strict grid even when their internal content differs.",
      "Top edges of sibling cards should snap to the same baseline where possible."
    ],
    "internal_card": [
      "Header area gets 12-16px bottom separation before main content.",
      "Numeric metrics should align left unless explicitly centered like a radial timer.",
      "Badges should not touch edges; leave at least 12px breathing room."
    ],
    "lists": [
      "Use 12-16px row height padding.",
      "Include light separators or spacing gaps, not heavy borders."
    ]
  },

  "states": {
    "interactive": {
      "hover": [
        "increase surface contrast slightly",
        "tiny upward or scale shift only if consistent",
        "icons can brighten subtly"
      ],
      "focus": [
        "visible ring using primary.300-400 in light mode",
        "visible ring using primary.400-500 in dark mode"
      ],
      "active": [
        "slight inset feel or darker tint",
        "avoid dramatic animation"
      ]
    },
    "data_states": {
      "default": "neutral surface + muted metadata",
      "highlighted": "accent primary fill or dark surface inversion",
      "completed": "accent + check icon",
      "warning": "amber tint + semantic warning text/icon",
      "disabled": "reduced contrast with preserved readability"
    },
    "empty_states": {
      "style": "minimal illustration or icon + concise label + helper action",
      "tone": "clean, not playful"
    }
  },

  "accessibility_notes": {
    "contrast": [
      "Primary gold on cream may fail for body text; use for fills and highlights, not long text.",
      "Body text should remain near-black on light and near-white on dark.",
      "Muted text must still meet readable contrast, especially in small metadata."
    ],
    "targets": [
      "All icon-only buttons should be comfortable tap targets.",
      "Pills and nav items should have enough vertical height for touch."
    ],
    "chart_accessibility": [
      "Never rely on color alone; include labels, counts, or icons.",
      "Radial and bar charts should expose textual equivalents."
    ]
  },

  "implementation_notes_for_developer": {
    "layout_principles": [
      "Build the screen from reusable card primitives with shared padding, radius, and shadow tokens.",
      "Use only tokenized color references; avoid hardcoding per-card colors.",
      "Reserve the dark card variant for emphasis panels or critical workflows."
    ],
    "token_usage_rules": [
      "Primary palette is for active status and highlights only.",
      "Secondary palette is for text, dark surfaces, and high-contrast interactive states.",
      "Neutrals carry most of the UI surface system.",
      "Gradients are allowed only on hero surface, media overlays, and circular chart accents.",
      "Shadows should remain soft and wide; avoid harsh layered shadows."
    ],
    "dark_mode_rules": [
      "Do not simply invert colors; preserve warm-neutral mood.",
      "Use slightly warm dark surfaces instead of cold blue-blacks.",
      "Keep one emphasized contrast card in the layout for structure."
    ]
  },

  "json_schema_suggestion_for_tokens": {
    "color_token_groups": [
      "primary",
      "secondary",
      "gray",
      "semantic",
      "special_effects"
    ],
    "component_token_groups": [
      "surface",
      "text",
      "border",
      "shadow",
      "radius",
      "spacing",
      "chart",
      "interactive"
    ]
  },
}
