<template>
   <div class="lizNews">
    


        <b-modal id="modalNews" ref="modalNewsLiz" title="Liz News -Log de atualizações." size="lg">
                <b-card style="width:100%; text-align:center; justify-content:center;">
                    <h3>{{ title  }}</h3>
                    <h6>{{ subtitle  }}</h6>
                    <p>{{  text }} </p>
                    <span>{{  dev }} // {{ date }}</span>
                </b-card>
        </b-modal>
    
    </div>
</template>

<script>
    export default {
        
        name: "lizNews",
       

        data(){
            return{

            }
        },
        mounted(){
             this.$refs.modalNewsLiz.show();
        },

        
    }
</script>

<style lang="scss" scoped>

</style>