import React from 'react'
import { Badge } from 'flowbite-react';
import { useTranslation } from 'react-i18next';

const TypeBadge = ({type, size="sm"}) => {
    const { t } = useTranslation("common");
    const typeConfig = {
      "1": { color: "teal", text: t("filters.apartment") },
      "2": { color: "yellow", text: t("filters.villa") },
      "3": { color: "gray", text: t("filters.office") },
      "4": { color: "warning", text: t("filters.land") },
      "5": { color: "lime", text: t("filters.detachedHouse") },
      "6": { color: "cyan", text: t("filters.building") },
      "7": { color: "indigo", text: t("filters.timeshare") },
      "8": { color: "light", text: t("filters.touristicFacility") },
    };
    const config = typeConfig[type] || { color: "gray", text: type };
    return (
      <Badge color={config.color} className={` ${size === "lg" ? "text-md" : "text-xs"}`}>
        {config.text}
      </Badge>
    );
  };

export default TypeBadge