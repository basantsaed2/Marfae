import { useSelector } from 'react-redux';
import { useMemo, useCallback } from 'react';

/**
 * Hook to check if the current user has a specific permission.
 * Assumes user permissions are stored in Redux at state.auth.permissions
 * as an array of lowercase permission names (strings).
 */
export const usePermissionCheck = () => {
    // UPDATED SELECTOR PATH: state.auth.permissions
    const userPermissions = useSelector(state => state.auth.permissions || []);

    // Convert all stored permission names to a Set for O(1) lookups
    const permissionSet = useMemo(() => {
        return new Set(userPermissions.map(p => String(p).toLowerCase()));
    }, [userPermissions]);

    /**
     * Checks if the user has a single permission or ANY permission from a list.
     * @param {string | string[]} requiredPermission - The name(s) of the permission(s) required.
     * @returns {boolean} True if the user has the required permission(s).
     */
    const hasPermission = useCallback((requiredPermission) => {
        if (!requiredPermission || requiredPermission === "") {
            // No permission defined means access is allowed
            return true;
        }

        const required = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];

        // Check if ANY of the required permissions exist in the user's set (OR logic)
        return required.some(perm => permissionSet.has(String(perm).toLowerCase()));
    }, [permissionSet]);

    return { hasPermission };
};