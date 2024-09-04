-- Trigger client-side event to show or hide HUD
RegisterCommand('togglehud', function(source, args, rawCommand)
    local visible = args[1] == 'show' -- 'show' or 'hide'
    TriggerClientEvent('hud:updateVisibility', source, visible)
end, false)

-- You would need to set up proper events to listen for pause menu or map state changes
