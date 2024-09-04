local QBCore = exports['qb-core']:GetCoreObject()

-- Function to get the current weapon ammo count
local function getCurrentWeaponAmmo()
    local playerPed = PlayerPedId()
    local weapon = GetSelectedPedWeapon(playerPed) -- Get the current weapon
    if weapon ~= nil and weapon ~= `WEAPON_UNARMED` then
        local ammo = GetAmmoInPedWeapon(playerPed, weapon) -- Get ammo count for the current weapon
        return ammo, true -- Return ammo count and true if a weapon is equipped
    end
    return 0, false -- Return 0 and false if no weapon is equipped
end

-- Function to update the HUD
local function updateHUD()
    local playerData = QBCore.Functions.GetPlayerData()
    local jobLabel = playerData.job and playerData.job.label or "Unknown"
    local jobGrade = playerData.job and playerData.job.grade and playerData.job.grade.name or "Not available"
    local cash = playerData.money and playerData.money.cash or 0
    local bank = playerData.money and playerData.money.bank or 0
    local serverId = GetPlayerServerId(PlayerId())
    local ammo, hasWeapon = getCurrentWeaponAmmo() -- Get current ammo count and check if a weapon is equipped

    -- Send data to the NUI to update the HUD
    SendNUIMessage({
        action = "updateHUD",
        jobLabel = jobLabel,
        jobGrade = jobGrade,
        cash = cash,
        bank = bank,
        serverId = serverId,
        ammo = ammo,
        hasWeapon = hasWeapon -- Include whether a weapon is equipped
    })
end

-- Update the HUD every 1 second
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(500) -- Wait 1 second between updates
        updateHUD()
    end
end)

-- Function to update HUD visibility
local function updateHUDVisibility(visible)
    SendNUIMessage({
        action = 'toggleHUD',
        visible = visible
    })
end

-- Function to check if the pause menu is active
local function isPauseMenuActive()
    return IsPauseMenuActive()
end

-- Main thread to manage HUD visibility based on pause menu state
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(500) -- Check every 500 milliseconds

        -- Determine if the HUD should be shown based on pause menu status
        local shouldShowHUD = not isPauseMenuActive()
        updateHUDVisibility(shouldShowHUD)
    end
end)
